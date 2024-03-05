import { Controller, Get, Next, Post, Req, Res } from '@nestjs/common';
import { ApiProduces, ApiTags } from '@nestjs/swagger';

import { BaseController } from '../base/base.controller';
import { Calendar } from "./calendar.schema";
import { CalendarService } from "./calendar.service";
import { GoogleCalendarService } from "./google/google.calendar.service";
import { CalendarAccountsService } from "./accounts/calendar.accounts.service";
import { Public } from "../auth/jwt/jwt.auth.guard";
import { MicrosoftCalendarService } from './microsoft/microsoft-calendar.service';

@Controller( 'calendar' )
@Public()
@ApiTags( 'calendar' )
export class CalendarController extends BaseController<Calendar> {

    /***/
    constructor(
        public service: CalendarService,
        private calendarAccountsService: CalendarAccountsService, 
        private googleCalendarService: GoogleCalendarService,
        private microsoftCalendarService: MicrosoftCalendarService,
    ) {
        super( service );
    }


    /**
     * authenticate user's google account
     *
     * @param req
     * @param res
     */
    @Get( '/google/authenticate' )
    @ApiProduces( 'application/json' )
    authenticateGoogleCalendar( @Req() req, @Res() res ): string  {
        const authUrl:string = this.googleCalendarService.authorize();
        return res.send( { url: authUrl } );
    }

    /**
     * authenticate user's google account
     *
     * @param req
     * @param res
     * @param next
     */
    @Get( '/microsoft/authenticate' )
    @ApiProduces( 'application/json' )
    async authenticateMicrosoftCalendar( @Req() req, @Res() res, @Next() next ): Promise<string> {
        const authUrl = await this.microsoftCalendarService.authorize();
        return res.send( { url: authUrl }  );
    }


    /**
     * redirect callback endpoint for the /google/authenticate
     *
     * @param req
     * @param res
     */
    @Get( '/google/authenticate/redirect' )
    async authenticateGoogleCalendarRedirect( @Req() req, @Res() res ): Promise<void>  {
        const tokenInfo = req.query.error ? { error: req.query.error } : await this.googleCalendarService.getUserInfo( req.query.code );
        const responseHTML = `<html lang="en"><head><title>Main</title></head><body></body><script>res = ${JSON.stringify(
            tokenInfo,
        )}; window.opener.postMessage(res, "*");window.close();</script></html>`;
        res.send( responseHTML );
    }

    /**
     * redirect callback endpoint for the /google/authenticate
     *
     * @param req
     * @param res
     * @param next
     */
    @Post( '/microsoft/authenticate/redirect' )
    async authenticateMicrosoftCalendarRedirect( @Req() req, @Res() res, @Next() next ): Promise<void>  {
        const tokenInfo =  await this.microsoftCalendarService.getUserInfo( req );
        const responseHTML = `<html lang="en"><head><title>Main</title></head><body></body><script>res = ${JSON.stringify(
            tokenInfo,
        )}; window.opener.postMessage(res, "*");window.close();</script></html>`;
        res.send( responseHTML );
    }

}

