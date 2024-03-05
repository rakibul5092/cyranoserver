import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ExceptionsModule } from 'src/modules/shared/exceptions/exceptions.module';
import { WeeklyRoutineController } from './weekly-routine.controller';
import { WeeklyRoutineEvent, WeeklyRoutineSchema } from './weekly-routine-event.schema';
import { WeeklyRoutineService } from './weekly-routine.service';

@Module( {
    imports: [
        MongooseModule.forFeature( [ { name: WeeklyRoutineEvent.name, schema: WeeklyRoutineSchema } ] ),
        JwtModule,
        ExceptionsModule
    ],
    controllers : [ WeeklyRoutineController ],
    providers   : [ WeeklyRoutineService ]
} )

export class WeeklyRoutineModule {}
