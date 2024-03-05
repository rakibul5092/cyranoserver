import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { SMSService } from "./sms.service";
import { Public } from "../../auth/jwt/jwt.auth.guard";

@Controller( 'sms' )
@Public()
// @ApiBearerAuth()
@ApiBearerAuth()
@ApiTags( 'email' )
@ApiConsumes( 'application/json' )
@ApiProduces( 'application/json' )
export class SMSController {

    constructor(
        private smsService: SMSService,
    ) { }

    /**
     * This GET API's just for the local testing purposes
     *
     * @param res
     * @param body
     * @param body.phoneNumber
     */
    @Post( "/send-test-sms" )
    async sendSms( @Body() body: { phoneNumber: string } ): Promise<any> {
        return this.smsService.sendSMS( body.phoneNumber );
    }

    @Post( '/verifyOTP' )
    varifyOTP( @Body() body: { phoneNumber: string, code: string } ): Promise<any> {
        return this.smsService.varifyOTP( body.phoneNumber, body.code );
    }

}
