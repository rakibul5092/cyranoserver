
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { AppUtilsService } from '../utils/app.utils.service';
import { Public } from '../../auth/jwt/jwt.auth.guard';
import { ExceptionsService } from "../exceptions/exceptions.service";

@Controller( 'email' )
@Public()
// @ApiBearerAuth()
@ApiBearerAuth()
@ApiTags( 'email' )
@ApiConsumes( 'application/json' )
@ApiProduces( 'application/json' )
export class EmailController {

    /***/
    constructor(
        private emailService: EmailService,
        private appUtilsService: AppUtilsService,
        private exceptionsService: ExceptionsService
    ) {}

    /**
     * This GET API's just for the local testing purposes
     */
    /*           @Get( "/send-test-email" )
    async sendEmail( @Res() res ): Promise< void > {
        try {
            await this.emailService.sendEmail( "enter_your_email_address", "test" );
            res.json( { success: true } );
        } catch ( e ) {
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.SEND_EMAIL_ERROR);
        }
    }*/

}
