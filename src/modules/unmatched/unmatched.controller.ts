import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/jwt/jwt.auth.guard';

import { BaseController } from '../base/base.controller';
import { Unmatched } from './unmatched.schema';
import { UnmatchedService } from './unmatched.service';

@Controller( 'unmatched' )
@ApiTags( 'unmatched' )
@Public()
export class UnmatchedController extends BaseController<Unmatched> {

    /***/
    constructor( public unmatchedService: UnmatchedService ) {
        super( unmatchedService );
    }

    @Post( 'registration' )
    async registration( @Body() body: { phoneNumber: string } ): Promise<any> {
        return await this.unmatchedService.registration( body.phoneNumber );
    }

    @Post( 'verify-otp' )
    async verifyOTP( @Body() body: { otp: string; phoneNumber: string } ): Promise<any> {
        return this.unmatchedService.verifyOTP( body.phoneNumber, body.otp );
    }

    @Post( 'resend-otp' )
    async resendOTP( @Body() body: { otp: string; phoneNumber: string } ): Promise<any> {
        return this.unmatchedService.resendOTP( body.phoneNumber );
    }

    @Post( 'match-profiles' )
    async getMatchingProfiles( @Body() intrest: Unmatched ): Promise<any> {
        return await this.unmatchedService.findUsersforSwippingByGender( intrest );
    }

    @Put( 'like/:id' )
    onLike( @Param( "id" ) id: string, @Body() body: { id: string } ): Promise<Unmatched> {
        return this.unmatchedService.onLike( id, body.id );
    }

    @Put( 'disLike/:id' )
    onDisLike( @Param( "id" ) id: string, @Body() body: { id: string } ): Promise<Unmatched> {
        return this.unmatchedService.onDisLike( id, body.id );
    }

    @Post( '/account-details/:id' )
    saveAccountDetails( @Body() body: Unmatched, @Param( 'id' ) id: string ): Promise<Unmatched> {
        return this.unmatchedService.saveAccountDetails( id, body );
    }

}
