import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { BaseController } from '../base/base.controller';
import { Users } from './users.schema';

@Controller( 'users' )
@ApiBearerAuth()
@ApiTags( 'users' )
export class UsersController extends BaseController<Users> {

    /***/
    constructor( public service: UsersService ) {
        super( service );
    }

}
