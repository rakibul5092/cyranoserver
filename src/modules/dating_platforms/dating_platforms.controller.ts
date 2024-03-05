import { Controller } from '@nestjs/common';
import { Public } from '../auth/jwt/jwt.auth.guard';
import { BaseController } from '../base/base.controller';
import { DatingPlatform } from './dating_platform.schema';
import { DatingPlatformsService } from './dating_platforms.service';

@Controller( 'dating-platforms' )
@Public()
export class DatingPlatformsController extends BaseController<DatingPlatform> {

    /***/
    constructor( public service: DatingPlatformsService ) {
        super( service );
    }

}
