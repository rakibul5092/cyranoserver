import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { passwordRegex } from "../../lookups/cyrano.lookups";
import { CUSTOM_ERROR_CODES } from "../shared/exceptions/exceptions.errors";
import { ExceptionsService } from "../shared/exceptions/exceptions.service";
import { AuthResponseModel } from './auth.response.model';
import { AuthService } from './auth.service';
import { AuthSocialService } from './auth.social.service';
import { Public } from './jwt/jwt.auth.guard';
import { AuthModel } from './models/auth.model';
import { AuthRegisterModel } from './models/auth.register.model';

@Controller( 'auth' )
@ApiTags( 'auth' )
@Public()
export class AuthController {

    /***/
    constructor(
        public authService: AuthService,
        private exceptionsService: ExceptionsService,
        public authSocialService: AuthSocialService,
    ) {}

    /**
     * Login user
     *
     * @param authModel
     */
    @Post( '/login' )
    @ApiResponse( {
        status      : 200,
        description : 'login success',
        type        : AuthResponseModel,
    } )
    async login( @Body() authModel: AuthModel ): Promise<AuthResponseModel> {
        return this.authService.login( authModel );
    }

    @Post( '/register' )
    @ApiResponse( {
        status      : 200,
        description : 'login success',
        type        : AuthResponseModel,
    } )

    /**
     * User
     */
    // eslint-disable-next-line require-jsdoc
    async register( @Body() authRegisterModel: AuthRegisterModel ): Promise<AuthResponseModel> {
        if( !passwordRegex.test( authRegisterModel.password ) ){
            this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.NOT_VALID_PASSWORD );
        }
        return this.authService.register( authRegisterModel );
    }

    /**
     * Sign in with Google
     */
    @UseGuards( AuthGuard( 'google' ) )
    @Get( '/login/google' )
    async signInWithGoogle(): Promise<void> {
        throw new HttpException( 'Not implemented yet', HttpStatus.NOT_IMPLEMENTED );
    }

    /**
     * Sign in with Google and redirect
     *
     * @param req
     * @param res
     */
    @UseGuards( AuthGuard( 'google' ) )
    @Get( '/google/redirect' )
    async signInWithGoogleRedirect( @Req() req, @Res() res ): Promise<void> {
        const loginData = await this.authSocialService.signInSocial( 'google', req );
        const responseHTML = `<html lang="en"><head><title>Main</title></head><body></body><script>res = ${JSON.stringify(
            loginData,
        )}; window.opener.postMessage(res, "*");window.close();</script></html>`;
        res.status( 200 ).send( responseHTML );
    }

    /**
     * Facebook login
     */
    @Get( '/login/facebook' )
    @UseGuards( AuthGuard( 'facebook' ) )
    async facebookLogin(): Promise<void> {
        throw new HttpException( 'Not implemented yet', HttpStatus.NOT_IMPLEMENTED );
    }

    /**
     * Facebook redirect
     *
     * @param req
     * @param res
     */
    @Get( '/facebook/redirect' )
    @UseGuards( AuthGuard( 'facebook' ) )
    async facebookLoginRedirect( @Req() req, @Res() res ): Promise<void> {
        const loginData = await this.authSocialService.signInSocial(
            'facebook',
            req,
        );
        const responseHTML = `<html lang="en"><head><title>Main</title></head><body></body><script>res = ${JSON.stringify(
            loginData,
        )}; window.opener.postMessage(res, "*");window.close();</script></html>`;
        res.status( 200 ).send( responseHTML );
    }

    /**
     * Twitter login
     */
    @Get( '/login/twitter' )
    @UseGuards( AuthGuard( 'twitter' ) )
    async twitterLogin(): Promise<void> {
        throw new HttpException( 'Not implemented yet', HttpStatus.NOT_IMPLEMENTED );
    }

    /**
     * twitter login redirect
     *
     * @param req
     * @param res
     */
    @Get( '/twitter/redirect' )
    @UseGuards( AuthGuard( 'twitter' ) )
    async twitterLoginRedirect( @Req() req, @Res() res ): Promise<void> {
        const loginData = await this.authSocialService.signInSocial( 'twitter', req );
        const responseHTML = `<html lang="en"><head><title>Main</title></head><body></body><script>res = ${JSON.stringify(
            loginData,
        )}; window.opener.postMessage(res, "*");window.close();</script></html>`;
        res.status( 200 ).send( responseHTML );
    }

    /**
     * Get logged in user info
     *
     * @param req
     * @param res
     */
    @Get( '/user' )
    @ApiResponse( {
        status      : 200,
        description : 'Current user data',
        type        : AuthResponseModel,
    } )
    async getUser( @Req() req, @Res() res ):Promise<void>{        
        if ( req.headers && req.headers.authorization ) {
            const data = await this.authService.decodeAndGetUser( req.headers );          
            return data ? res.status( 200 ).send( data ) : res.status( 401 ).send( 'unauthorized' );
        }        
        return res.send( 500 );
    }

}
