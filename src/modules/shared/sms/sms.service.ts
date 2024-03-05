import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { AppUtilsService } from "../utils/app.utils.service";
import { Twilio } from "twilio";


@Injectable()
export class SMSService {

    private client: Twilio

    /***/
    constructor( private appUtilsService: AppUtilsService, private configService: ConfigService ) {
        this.client = new Twilio( this.configService.get( 'TWILIO_ACCOUNT_SID' ),
            this.configService.get( 'TWILIO_AUTH_TOKEN' ) );
    }

    /**
     *
     * @param to user phone number
     * @param body of the SMS
     */
    public async sendSMS( to: string ): Promise<any> {
        return this.client
            .verify
            .v2
            .services( this.configService.get( "TWILIO_SERVICE_SID" ) )
            .verifications
            .create( {
                to      : to,
                channel : "sms"
            } );
    }

    varifyOTP( to: string, code: string ): Promise<any> {
        return this.client
            .verify
            .services( this.configService.get( "TWILIO_SERVICE_SID" ) )
            .verificationChecks
            .create( {
                code : code,
                to   : to
            } );
    }

}
