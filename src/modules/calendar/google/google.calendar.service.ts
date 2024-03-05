import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import { CalendarAccountEnum } from "../../../enums/calendar.account.enum";
import { CalendarEventDto } from "../../../dto/calendar.event.dto";

@Injectable()
export class GoogleCalendarService {

    private readonly oauth2Client: OAuth2Client;
    private scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/userinfo.profile',
        'email'
    ];

    /***/
    constructor( private configService: ConfigService ) {
        this.oauth2Client = new google.auth.OAuth2(
            configService.get( 'GOOGLE_CALENDAR_CLIENT_ID' ),
            configService.get( 'GOOGLE_CALENDAR_SECRET' ),
            configService.get( 'GOOGLE_CALENDAR_REDIRECT_URL' ),
        );
        google.options( { auth: this.oauth2Client } );
    }

    /**
     * generate auth url
     *
     * @param scopes
     */
    public authorize( scopes = this.scopes ): string{
        return this.oauth2Client.generateAuthUrl( {
            access_type : "offline",
            prompt      : "consent",
            state       : "GOOGLE_LOGIN",
            scope       : scopes.join( ' ' ),
        } );
    }

    /**
     *
     * get calendar user information
     *
     * @param code
     */
    public async getUserInfo(  code: string ): Promise<{email: string, token: string}>{
        const { tokens } = await this.oauth2Client.getToken( code );
        this.oauth2Client.setCredentials( { access_token: tokens.access_token } );
        const oauth2 = google.oauth2( {
            auth    : this.oauth2Client,
            version : 'v2'
        } );
        const { data } = await oauth2.userinfo.get();
        return { email: data.email, token: tokens.refresh_token }
    }


    /**
     *
     * get user calendar events
     *
     * @param refresh_token
     * @param email
     * @param accountId
     * @param startDate
     * @param endDate
     */
    public async getEvents(  refresh_token: string, email: string, accountId, startDate: string, endDate:string ): Promise<CalendarEventDto[]>{
        this.oauth2Client.setCredentials( {  refresh_token  } );
        const calendar = google.calendar( { version: 'v3', auth: this.oauth2Client } );
        const res = await calendar.events.list( {
            calendarId   : 'primary',
            timeMin      : startDate,
            timeMax      : endDate,
            singleEvents : true,
        } );
        const events = res.data.items;
        if ( !events || events.length === 0 ) {
            Logger.log( 'No upcoming google events found.' );
            return [];
        }
        return  events.map( event => {
            return {
                _id       : event.id,
                title     : event.summary,
                startDate : event.start.dateTime,
                startTime : event.start.dateTime,
                endDate   : event.end.dateTime,
                endTime   : event.end.dateTime,
                email,
                accountId,
                type      : CalendarAccountEnum.GOOGLE
            }
        } );
    }


    /**
     * delete google calendar event
     *
     * @param refreshToken
     * @param eventId
     */
    public async deleteEvent(  refreshToken: string, eventId: string ): Promise<void>{
        this.oauth2Client.setCredentials( {  refresh_token: refreshToken  } );
        const calendar = google.calendar( { version: 'v3', auth: this.oauth2Client } );
        await calendar.events.delete( {
            calendarId: 'primary',
            eventId
        } )
    }


    /**
     * update event
     *
     * @param refresh_token
     * @param eventId
     * @param event
     */
    public async updateEvent(  refresh_token: string, eventId: string, event: Partial<CalendarEventDto> ): Promise<void>{
        this.oauth2Client.setCredentials( { refresh_token  } );
        const calendar = google.calendar( { version: 'v3', auth: this.oauth2Client } );
        await calendar.events.update( {
            calendarId  : 'primary',
            eventId,
            requestBody : {
                summary : event.title,
                start   : {
                    dateTime: event.startDate
                },
                end: {
                    dateTime: event.endDate
                },
                description: event.note
            }
        } );
    }

}
