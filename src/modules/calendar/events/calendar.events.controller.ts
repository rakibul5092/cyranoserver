import {
    Body,
    Controller, Delete,
    Get,
    HttpException, HttpStatus,
    Logger,
    Param,
    Post,
    Put, Query,
    Res,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../base/base.controller';
import { CalendarEventsService } from "./calendar.events.service";
import { CalendarEvent } from "./calendar.events.schema";
import { CalendarAccountsService } from "../accounts/calendar.accounts.service";
import { CalendarAccount } from "../accounts/calendar.accounts.schema";
import { CalendarAccountEnum } from "../../../enums/calendar.account.enum";
import { GoogleCalendarService } from "../google/google.calendar.service";
import { CalendarEventDto } from "../../../dto/calendar.event.dto";
import { CUSTOM_ERROR_CODES } from "../../shared/exceptions/exceptions.errors";
import { ExceptionsService } from "../../shared/exceptions/exceptions.service";
import { CalendarAccountDto } from '../../../dto/calendar.account.dto';


@Controller( 'calendar-events' )
@ApiBearerAuth()
@ApiTags( 'calendar-events' )
export class CalendarEventController extends BaseController<CalendarEvent> {

    /***/
    constructor( public service: CalendarEventsService,
        private exceptionsService: ExceptionsService,
        private calendarAccountsService: CalendarAccountsService,
        private googleCalendarService: GoogleCalendarService ) {
        super( service );
    }


    /**
     * Save event
     *
     * @param entity
     * @param res
     */
    @Post()
    @ApiConsumes( 'application/json' )
    @ApiProduces( 'application/json' )
    @UsePipes( new ValidationPipe( { transform: true } ) )
    async saveEvent( @Body() entity: CalendarEvent, @Res() res ): Promise<void> {
        const event:CalendarEvent = await this.service.save( entity );
        res.send( event );
    }


    /**
     * Update event by id
     *
     * @param id
     * @param entity
     */
    @Put( ':id' )
    @ApiConsumes( 'application/json' )
    @ApiProduces( 'application/json' )
    @UsePipes( new ValidationPipe( { transform: true } ) )
    async updateEvent( @Param( 'id' ) id: string, @Body() entity: CalendarEvent ): Promise<CalendarEvent> {
        return this.service.update( id, entity );
    }

    /**
     * Update google event
     *
     * @param eventId
     * @param accountId
     * @param event
     * @param res
     */
    @Put( 'google/:eventId/account/:accountId' )
    @ApiConsumes( 'application/json' )
    @ApiProduces( 'application/json' )
    @UsePipes( new ValidationPipe( { transform: true } ) )
    async updateGoogleEvent( @Param( 'eventId' ) eventId: string,
        @Param( 'accountId' ) accountId: string,
        @Body() event: CalendarEventDto,
        @Res() res ): Promise<void> {
        const account: CalendarAccount = await this.getAccount( accountId );
        try {
            await this.googleCalendarService.updateEvent( account.token, eventId, event );
            res.send( event );
        } catch ( error ) {
            Logger.error( error );
            throw new HttpException( error, HttpStatus.INTERNAL_SERVER_ERROR );
        }
    }

    /**
     * delete google event
     *
     * @param eventId
     * @param res
     * @param accountId
     */
    @Delete( 'google/:eventId/account/:accountId' )
    async deleteGoogleEvent( @Param( 'eventId' ) eventId: string, @Res() res,
        @Param( 'accountId' ) accountId: string ): Promise<void> {
        const account: CalendarAccount = await this.getAccount( accountId );
        try {
            await this.googleCalendarService.deleteEvent( account.token, eventId );
            res.send();
        } catch ( error ) {
            Logger.error( error );
            throw new HttpException( error, HttpStatus.INTERNAL_SERVER_ERROR );
        }
    }

    /**
     * Get user calendars events [ cyrano, google, microsoft ]
     *
     * @param userId
     * @param res
     * @param startDate
     * @param endDate
     */
    @Get( '/user/:userId' )
    @ApiResponse( {
        status      : 200,
        description : 'get user calendar events successfully',
        type        : CalendarEventDto,
    } )
    async getCalendarEvents( @Param( 'userId' ) userId: string, @Res() res,
        @Query( 'startDate' ) startDate: string, @Query( 'endDate' ) endDate: string ): Promise<void> {
        const cyranoEvents: CalendarEventDto[] = await this.service.find( startDate && endDate ?
            { userId, startDate: { $gte: startDate }, endDate: { $lte: endDate } }: { userId } );
        let googleEvents: CalendarEventDto[] = [];
        const activeGoogleCalendars: CalendarAccountDto[] = await this.calendarAccountsService.find( {
            userId, 
            active : true, 
            type   : CalendarAccountEnum.GOOGLE 
        } );
        if( activeGoogleCalendars && activeGoogleCalendars.length > 0 ) {
            try {
                await Promise.all(
                    activeGoogleCalendars.map( async ( calendarAccount ) => {
                        const events: CalendarEventDto[] = await this.googleCalendarService.getEvents( calendarAccount.token,
                            calendarAccount.email, calendarAccount._id, startDate, endDate );
                        googleEvents = googleEvents.concat( events );
                    } )
                );
                res.send( googleEvents.concat( cyranoEvents ) );
            } catch( error ) {
                Logger.error( error );
                throw new HttpException( error, HttpStatus.INTERNAL_SERVER_ERROR );
            }
        } else {
            res.send( cyranoEvents );
        }
    }


    /**
     * get calendar account
     *
     * @param accountId
     * @private
     */
    private async getAccount( accountId: string ): Promise<CalendarAccount> {
        const account: CalendarAccount = await this.calendarAccountsService.findById( accountId );
        if( !account || !account.token ){
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.NOT_VALID_CALENDAR_ACCOUNT );
        }
        return account;
    }

}
