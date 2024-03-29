import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy( Strategy, 'google' ) {

    /***/
    constructor( private configService: ConfigService ) {
        super( {
            clientID     : configService.get( 'GOOGLE_CLIENT_ID' ),
            clientSecret : configService.get( 'GOOGLE_SECRET' ),
            callbackURL  : configService.get( 'GOOGLE_REDIRECT_URL' ),
            scope        : [ 'email', 'profile' ],
        } );
    }

    /***/
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, id } = profile;
        const userInfo = {
            id        : id,
            email     : emails[0].value,
            firstName : name.givenName,
            lastName  : name.familyName,
            accessToken,
        };
        const payload = {
            userInfo,
            accessToken,
        };
        done( null, payload );
    }

}
