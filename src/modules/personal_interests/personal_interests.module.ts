import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PersonalInterestsController } from './personal_interests.controller';
import { PersonalInterestsService } from './personal_interests.service';
import { PersonalInterest, PersonalInterestSchema } from './personal_interest.schema';

@Module( {
    imports: [
        MongooseModule.forFeature( [ { name: PersonalInterest.name, schema: PersonalInterestSchema } ] ),
    ],
    controllers : [ PersonalInterestsController ],
    providers   : [ PersonalInterestsService ],
    exports     : [ PersonalInterestsService ],
} )
export class PersonalInterestsModule {}
