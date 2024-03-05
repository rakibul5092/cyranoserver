import { Body, Controller, Delete, Get, Post, Put, Req, Param } from "@nestjs/common";
import { ApiResponse, ApiBearerAuth, ApiTags, ApiProduces } from "@nestjs/swagger";
import { CUSTOM_ERROR_CODES } from "src/modules/shared/exceptions/exceptions.errors";
import { ExceptionsService } from "src/modules/shared/exceptions/exceptions.service";
import { BaseController } from "../../base/base.controller";
import { WeeklyRoutineEvent } from "./weekly-routine-event.schema";
import { WeeklyRoutineService } from "./weekly-routine.service";

@Controller( '/weekly-routine' )
@ApiTags( 'Weekly routine' )
@ApiBearerAuth()

export class WeeklyRoutineController extends BaseController<WeeklyRoutineEvent> {

    constructor( public weeklyRoutineService: WeeklyRoutineService, public exceptionService: ExceptionsService ) {
        super( weeklyRoutineService );
    }

    @Get()
    @ApiResponse( {
        status      : 200,
        description : "Weekly Routine"
    } )
    @ApiProduces( 'application/json' )
    async fetchRoutine ( @Req() req ): Promise<WeeklyRoutineEvent[]> {
        if( req.headers && req.headers.authorization ){
            const userId = this.weeklyRoutineService.getUserId( req.headers.authorization );
            const routine =  await this.weeklyRoutineService.findEvents( userId );
            if( routine === null ){
                this.exceptionService.throwHttpCustomException( CUSTOM_ERROR_CODES.RESOURCE_NOT_FOUND );
            }
            return routine;
        }
    }

    @Post()
    async addRoutineEvent( @Body() data: WeeklyRoutineEvent, @Req() req ): Promise<void> {
        const userId = this.weeklyRoutineService.getUserId( req.headers.authorization );
        data.userId = userId;
        const saved = await this.weeklyRoutineService.save( data )
        return saved;
    }

    @Put( ':id' )
    async updateRoutine( @Param( 'id' ) id: string, @Body() data: WeeklyRoutineEvent, @Req() req ): Promise<void> {
        const userId = this.weeklyRoutineService.getUserId( req.headers.authorization );
        const routineEvent = await this.weeklyRoutineService.findOneAndUpdate( { _id: id, userId: userId }, data );

        //  check if event belongs to the user with the token
        if( routineEvent ){
            return routineEvent;
        }else{
            this.exceptionService.throwHttpCustomException( CUSTOM_ERROR_CODES.INVALID_EVENT );
        }
    }

    @Delete( ':id' )
    async deleteRoutine( @Param( 'id' ) id: string, @Req() req ): Promise<WeeklyRoutineEvent> {
        const userId = this.weeklyRoutineService.getUserId( req.headers.authorization );
        const routineEvent = await this.weeklyRoutineService.findOneAndDelete( { _id: id, userId: userId } )
        if( routineEvent ){
            return routineEvent;
        }else{
            this.exceptionService.throwHttpCustomException( CUSTOM_ERROR_CODES.INVALID_EVENT );
        }
    }

}
