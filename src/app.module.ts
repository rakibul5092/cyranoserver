import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt/jwt.auth.guard';
import { UnmatchedModule } from './modules/unmatched/unmatched.module';
import { DatingPlatformsModule } from './modules/dating_platforms/dating_platforms.module';
import { AwsModule } from './modules/shared/aws/aws.module';
import { EmailModule } from './modules/shared/email/email.module';
import { ExceptionsModule } from "./modules/shared/exceptions/exceptions.module";
import { WeeklyRoutineModule } from './modules/calendar/weekly-routine/weekly-routine.module';
import { PaymentModule } from "./modules/shared/payment/payment.module";
import { SMSModule } from "./modules/shared/sms/sms.module";
import { UsersModule } from './modules/users/users.module';
import { PersonalInterestsModule } from './modules/personal_interests/personal_interests.module';
import { CalendarModule } from "./modules/calendar/calendar.module";

@Module( {
    imports: [
        UsersModule,
        AuthModule,
        MongooseModule.forRootAsync( {
            imports    : [ ConfigModule ],
            useFactory : async ( configService: ConfigService ) => {
                return { uri: configService.get( 'DATABASE_URL' ) };
            },
            inject: [ ConfigService ],
        } ),
        ConfigModule.forRoot( {
            envFilePath : !process.env.MODE ? '.env' : `.env.${process.env.MODE}`,
            isGlobal    : true,
        } ),
        AwsModule,
        EmailModule,
        SMSModule,
        PaymentModule,
        ExceptionsModule,
        WeeklyRoutineModule,
        UnmatchedModule,
        DatingPlatformsModule,
        PersonalInterestsModule,
        CalendarModule
    ],
    providers: [
        {
            provide  : APP_GUARD,
            useClass : JwtAuthGuard,
        }
    ]
} )
export class AppModule { }
