import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { Users } from '../users/users.schema';
import { AuthRegisterModel } from './models/auth.register.model';
import { AuthResponseModel } from './auth.response.model';
import { ForgotPasswordModel } from "./models/auth.forgot.password.model";
import { AppUtilsService } from "../shared/utils/app.utils.service";
import { ResponseModel } from "../shared/models/response.model";
import { EmailService } from "../shared/email/email.service";
import { ConfigService } from '@nestjs/config';
import { ExceptionsService } from "../shared/exceptions/exceptions.service";
import { CUSTOM_ERROR_CODES } from "../shared/exceptions/exceptions.errors";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    /***/
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private appUtilsService: AppUtilsService,
        private emailService: EmailService,
        private configService: ConfigService,
        private exceptionsService: ExceptionsService
    ) {}

    /**
     * Validate user
     *
     * @param phone
     * @param pass
     */
    async validateUser( phone: string, pass: string ): Promise<any> {
        const user = await this.usersService.findOne( { phone: phone } );
        if ( user && user.password === pass ) {
            return user;
        }
        return null;
    }

    /**
     *
     * @param user
     */
    async login( user: any ): Promise<AuthResponseModel> {
        const userData = await this.usersService.findOne( { email: user.email }, 'grasshoper'  );
        if ( userData && bcrypt.compare( user.password, userData.password ) ) {
            const payload = { username: user.email, sub: userData._id };
            return {
                access_token : this.jwtService.sign( payload ),
                user         : userData,
            };
        } else {
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.RESOURCE_NOT_FOUND );
        }
    }

    /**
     * Register user
     *
     * @param user
     */
    async register( user: AuthRegisterModel ): Promise<AuthResponseModel> {
        const userInfo = await this.usersService.findOne( { email: user.email } );
        if ( userInfo ) {
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.EMAIL_ALREADY_EXISTS );
        }
        const newUser = new Users();
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.email = user.email;
        newUser.password = await bcrypt.hash( user.password, 10 );
        newUser.inviteCode = user.inviteCode;
        newUser.phone = user.phone?.internationalNumber ?? user.phone;
        newUser.unmatched = user.unmatched;
        const userData = await this.usersService.save( newUser );
        const payload = { username: user.email, sub: userData._id };
        delete userData.password;
        return {
            access_token : this.jwtService.sign( payload ),
            user         : userData,
        };
    }

    /**
     * send email verification code
     *
     * @param forgotPasswordModel
     */
    async forgotPassword( forgotPasswordModel: ForgotPasswordModel ): Promise<ResponseModel> {
        const userData = await this.getUser( forgotPasswordModel.email );
        let retries = userData.resetPassword && userData.resetPassword.retries ? userData.resetPassword.retries + 1 : 1;
        if( retries > this.configService.get( 'AUTH_VERIFY_EMAIL_RETRIES' ) ){
            if( !this.appUtilsService.lessThanHoursAgo( userData.resetPassword.resetDate, 1 ) ){
                retries = 1;
            } else{
                this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.MAX_RETRIES_ERROR );
            }
        }
        const code = this.appUtilsService.randomCode( 4, true );
        try {
            await this.usersService.update( userData._id, { resetPassword: { code, retries, resetDate: new Date()  } } );
            await this.emailService.sendResendPasswordEmail( userData.email, userData.firstName, code );
            return new ResponseModel( true, {
                retries,
                retriesMax: this.configService.get( 'AUTH_VERIFY_EMAIL_RETRIES' )
            } );
        } catch ( e ){
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.RESET_PASSWORD_EMAIL_ERROR, e );
        }
    }


    /**
     * verify email
     *
     * @param forgotPasswordModel
     */
    async verifyEmail( forgotPasswordModel: ForgotPasswordModel ): Promise<ResponseModel> {
        const userData = await this.getUser( forgotPasswordModel.email );
        if ( !userData.resetPassword || userData.resetPassword.code !== forgotPasswordModel.code ||
            !this.appUtilsService.lessThanHoursAgo( userData.resetPassword.resetDate, 1 )  ){
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.INVALID_CODE );
        }
        await this.usersService.update( userData._id, { resetPassword: { ...userData.resetPassword, verified: true  } } );
        return new ResponseModel();
    }


    /**
     * reset password
     *
     * @param forgotPasswordModel
     */
    async resetPassword( forgotPasswordModel: ForgotPasswordModel ): Promise<AuthResponseModel> {
        const userData = await this.getUser( forgotPasswordModel.email );
        if ( !userData.resetPassword || !userData.resetPassword.verified || 
            !this.appUtilsService.lessThanHoursAgo( userData.resetPassword.resetDate, 1 )  ){
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.NOT_VERIFIED_USER );
        }
        if ( !forgotPasswordModel.password ){
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.MISSING_PASSWORD );
        }
        if ( userData.password === forgotPasswordModel.password  ){
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.OLD_PASSWORD );
        }
        await this.usersService.update( userData._id, {
            resetPassword : { ...userData.resetPassword, verified: false, retries: 0, code: '' },
            password      : forgotPasswordModel.password
        } );
        const payload = { username: userData.email, sub: userData._id };
        return {
            access_token : this.jwtService.sign( payload ),
            user         : userData,
        };
    }


    /**
     * Get user using token
     * 
     * @param headers 
     * @param res 
     * @returns 
     */
    public async decodeAndGetUser( headers ):Promise<any>{
        let token = headers.authorization;
        if( headers.authorization.includes( 'Bearer' ) ){
            token = headers.authorization.split( ' ' )[1]; 
        }
        try {
            const decoded = this.jwtService.verify( token,{ secret: process.env.JWT_SECRET } );
            return { access_token: token, user: await this.usersService.findOne( { _id: decoded.sub } ) }
        } catch ( e ) {
            return null
        }
    }

    /**
     * update account details
     *
     * @param userEmail
     * @param newAccountDetails
     */
    async updateAccountDetails( userEmail: string, newAccountDetails: AuthRegisterModel ): Promise<AuthResponseModel> {
        const userData = await this.getUser( userEmail );
        newAccountDetails.password = await bcrypt.hash( newAccountDetails.password, 10 );
        await this.usersService.update( userData._id, newAccountDetails );
        const payload = { username: userData.email, sub: userData._id };
        return {
            access_token : this.jwtService.sign( payload ),
            user         : userData,
        };
    }


    /**
     * get and verify user info for reset password
     *
     * @param email
     * @private
     */
    private async getUser( email: string ): Promise<any> {
        if ( !email ) {
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.EMAIL_NOT_FOUND );
        }
        const userData = await this.usersService.findOne( { email } );
        if ( !userData ) {
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.EMAIL_NOT_REGISTERED );
        }
        return userData;
    }

}
