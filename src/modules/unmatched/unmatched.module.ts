import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UnmatchedController } from './unmatched.controller';
import { UnmatchedService } from './unmatched.service';
import { Unmatched, UnmatchedSchema } from './unmatched.schema';
import { PersonalInterestsModule } from '../personal_interests/personal_interests.module';
import { SMSModule } from '../shared/sms/sms.module';
import { AuthModule } from '../auth/auth.module';

@Module( {
    imports: [
        MongooseModule.forFeature( [ { name: Unmatched.name, schema: UnmatchedSchema } ] ), PersonalInterestsModule, SMSModule, AuthModule
    ],
    controllers : [ UnmatchedController ],
    providers   : [ UnmatchedService ],
    exports     : [ UnmatchedService ],
} )
export class UnmatchedModule { }
