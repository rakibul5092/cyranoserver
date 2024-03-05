import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from './jwt/jwt.auth.guard';
import { AuthResponseModel } from './auth.response.model';
import { ForgotPasswordModel } from "./models/auth.forgot.password.model";
import { ResponseModel } from "../shared/models/response.model";
import { passwordRegex } from "../../lookups/cyrano.lookups";
import { CUSTOM_ERROR_CODES } from "../shared/exceptions/exceptions.errors";
import { ExceptionsService } from "../shared/exceptions/exceptions.service";

@Controller( 'password' )
@ApiTags( 'password' )
@Public()
export class AuthPasswordController {

    /***/
    constructor( public authService: AuthService,
        private exceptionsService: ExceptionsService ) {}
    

    /**
     * Forgot Password Email
     *
     * @param forgotPasswordModel
     */
    @Post( '/forgot' )
    @ApiResponse( {
        status      : 200,
        description : 'Forgot password send email success',
        type        : AuthResponseModel
    } )
    async forgotPassword( @Body() forgotPasswordModel: ForgotPasswordModel ): Promise<ResponseModel> {
        return this.authService.forgotPassword( forgotPasswordModel );
    }


    /**
     * Forgot Password/ Verify Email
     *
     * @param forgotPasswordModel
     */
    @Post( '/verify' )
    @ApiResponse( {
        status      : 200,
        description : 'Forgot password verify email success',
        type        : AuthResponseModel
    } )
    async verifyEmail( @Body() forgotPasswordModel: ForgotPasswordModel ): Promise<ResponseModel> {
        return this.authService.verifyEmail( forgotPasswordModel );
    }


    /**
     * Forgot Password Reset
     *
     * @param forgotPasswordModel
     */
    @Post( '/reset' )
    @ApiResponse( {
        status      : 200,
        description : 'Reset password success',
        type        : AuthResponseModel,
    } )
    async resetPassword( @Body() forgotPasswordModel: ForgotPasswordModel ): Promise<AuthResponseModel> {
        if( !passwordRegex.test( forgotPasswordModel.password ) ){
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.NOT_VALID_PASSWORD );
        }
        return this.authService.resetPassword( forgotPasswordModel );
    }

}
