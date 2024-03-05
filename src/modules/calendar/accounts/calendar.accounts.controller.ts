import { Body, Controller, Get, Param, Post, Put, Query, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../base/base.controller';
import { CalendarAccountsService } from "./calendar.accounts.service";
import { MongoExceptionFilter } from "../../shared/exceptions/mongo-exception-filter";
import { ExceptionsService } from "../../shared/exceptions/exceptions.service";
import { CUSTOM_ERROR_CODES } from "../../shared/exceptions/exceptions.errors";
import { CalendarAccount } from './calendar.accounts.schema';

@Controller( 'calendar-accounts' )
@ApiBearerAuth()
@ApiTags( 'calendar-accounts' )
export class CalendarAccountController extends BaseController<CalendarAccount> {

    /***/
    constructor( public service: CalendarAccountsService, private exceptionsService: ExceptionsService ) {
        super( service );
    }

    
    
    /**
     * Save entity
     *
     * @param entity
     */
    @Post()
    @ApiConsumes( 'application/json' )
    @ApiProduces( 'application/json' )
    @UseFilters( MongoExceptionFilter )
    @UsePipes( new ValidationPipe( { transform: true } ) )
    async save( @Body() entity: CalendarAccount ): Promise<CalendarAccount> {
        const userCalendars: CalendarAccount[] = await this.service.find( { userId: entity.userId } );
        if ( userCalendars && userCalendars.length === 10 ) {
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.MAX_CALENDARS_REACHED );
        }
        return this.service.save( entity );
    }

    
    
    /**
     * Update with ID
     *
     * @param id
     * @param entity
     */
    @Put( ':id' )
    @ApiConsumes( 'application/json' )
    @ApiProduces( 'application/json' )
    @UseFilters( MongoExceptionFilter )
    @UsePipes( new ValidationPipe( { transform: true } ) )
    async update( @Param( 'id' ) id: string, @Body() entity: CalendarAccount ): Promise<CalendarAccount> {
        return this.service.update( id, entity );
    }


    /**
     * GET USER CALENDARS
     *
     * @param userId
     * @param active
     */
    @Get( '/user/:userId' )
    @ApiResponse( {
        status      : 200,
        description : 'get user calendar accounts successfully',
        type        : CalendarAccount,
    } )
    async getCalendarAccounts( @Param( 'userId' ) userId: string,
        @Query( 'active' ) active: boolean ): Promise<CalendarAccount[]> {
        return active ? this.service.find( { userId, active } ): this.service.find( { userId } );
    }

}
