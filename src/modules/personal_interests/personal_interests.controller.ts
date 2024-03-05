import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/jwt/jwt.auth.guard';

import { BaseController } from '../base/base.controller';
import { PersonalInterest } from './personal_interest.schema';
import { PersonalInterestsService } from './personal_interests.service';

@Controller( 'personal_interests' )
@ApiTags( 'personal_interests' )
@Public()
export class PersonalInterestsController extends BaseController<PersonalInterest> {

    /***/
    constructor( public personalinterestsService: PersonalInterestsService ) {
        super( personalinterestsService );
    }

}
