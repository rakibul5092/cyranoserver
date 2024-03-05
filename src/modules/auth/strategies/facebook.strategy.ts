import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy( Strategy, 'facebook' ) {
    
    constructor( private configService: ConfigService ) {
        super( {
            clientID      : configService.get( 'FACEBOOK_CLIENT_ID' ),
            clientSecret  : configService.get( 'FACEBOOK_SECRET' ),
            callbackURL   : configService.get( 'FACEBOOK_REDIRECT_URL' ),
            scope         : 'email',
            profileFields : [ 'emails', 'name' ],
        } );
    }

    /***/
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: ( err: any, user: any, info?: any ) => void,
    ): Promise<any> {
        const { name, emails, id } = profile;
        const userInfo = {
            id        : id,
            email     : emails[0].value,
            firstName : name.givenName,
            lastName  : name.familyName,
        };
        const payload = {
            userInfo,
            accessToken,
        };

        done( null, payload );
    }

}
