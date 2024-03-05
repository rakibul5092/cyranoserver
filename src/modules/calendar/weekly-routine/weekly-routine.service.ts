import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from "src/modules/base/base.service";
import { WeeklyRoutineEventDocument, WeeklyRoutineEvent } from "./weekly-routine-event.schema";

@Injectable()
export class WeeklyRoutineService extends BaseService<WeeklyRoutineEventDocument, WeeklyRoutineEvent> {

    constructor(
        @InjectModel( WeeklyRoutineEvent.name ) private weeklyRoutineModel: Model<WeeklyRoutineEventDocument>,
        private jwtService: JwtService, ){
        super( weeklyRoutineModel )
    }

    public getUserId( authToken: string ): string {
        if( authToken.includes( "Bearer" ) ){
            authToken = authToken.split( " " )[1];
        }
        const data = this.jwtService.verify( authToken, { secret: process.env.JWT_SECRET } );
        return data.sub;
    }

    public async  getWeeklyRoutines ( userId: string ): Promise<any> {
        return this.findOne( { unmatched_id: userId } )
    }

    public async findEvents ( id: string ): Promise<WeeklyRoutineEvent[]> {
        return this.weeklyRoutineModel.find( { userId: id } )
    }

}
