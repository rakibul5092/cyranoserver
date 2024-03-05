import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { ConfigService } from "@nestjs/config";
import * as fs from 'fs'
import * as Mustache from "mustache";
import { AppUtilsService } from '../utils/app.utils.service';

@Injectable()
export class EmailService {

    private ses: SES

    /***/
    constructor( private appUtilsService: AppUtilsService, private configService: ConfigService ) {
        this.ses = new SES( {
            apiVersion      : "2010-12-01",
            accessKeyId     : this.configService.get( 'AWS_ACCESS_KEY_ID' ),
            secretAccessKey : this.configService.get( 'AWS_SECRET_ACCESS_KEY' ),
            region          : this.configService.get( 'AWS_SES_REGION' )
        } );
    }

    /**
     *
     * @param to
     * @param subject
     * @param output
     */
    public async sendEmail( to: string, subject: string, output: string ): Promise<any> {
        const params = {
            Destination: {
                /* required */
                CcAddresses : [ to ],
                ToAddresses : [ to ],
            },
            Message: {
                Body: {
                    Html: {
                        Charset : "UTF-8",
                        Data    : output,
                    },
                    Text: {
                        Charset : "UTF-8",
                        Data    : output,
                    },
                },
                Subject: {
                    Charset : "UTF-8",
                    Data    : subject,
                },
            },
            Source           : this.configService.get( 'AWS_SES_SENDER_EMAIL_ADDRESS' ),
            ReplyToAddresses : [ this.configService.get( 'AWS_SES_SENDER_EMAIL_ADDRESS' ) ],
        };
        return this.ses.sendEmail( params ).promise();
    }


    /**
     *
     * @param to
     * @param username
     * @param code
     */
    public async sendResendPasswordEmail( to, username, code ): Promise<any> {
        fs.readFile( process.cwd() + '/src/modules/shared/email/templates/confirm-password.html', 'utf8',
            ( err, contents ) => {
                const output = Mustache.render( contents, { username, code } );
                return this.sendEmail( to, 'Cyrano - Password Reset', output )
            } );
    }


    /**
     *
     * @param to
     * @param verificationCode
     * @param ownerId
     * @param username
     * @param password
     */
    public async verifyEmail( to, verificationCode, ownerId, username, password ): Promise<any> {
        const urlToBeSent = this.configService.get( 'FRONT_END_URL' ) + '/auth/verify_email/' + ownerId + '/' + verificationCode;
        fs.readFile( process.cwd() + '/src/modules/shared/email/templates/verify-email.html', 'utf8',
            ( err, contents ) => {
                const output = Mustache.render( contents, {
                    username : username,
                    url      : urlToBeSent
                } );
                return this.sendEmail( to, 'Cyrano Email Invitation', output )
            } );
    }

}
