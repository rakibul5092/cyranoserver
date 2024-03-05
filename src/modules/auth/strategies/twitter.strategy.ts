import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-twitter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterStrategy extends PassportStrategy( Strategy, 'twitter' ) {

    /***/
    constructor( private configService: ConfigService ) {
        super( {
            consumerKey             : configService.get( 'TWITTER_CLIENT_ID' ),
            consumerSecret          : configService.get( 'TWITTER_SECRET' ),
            callbackURL             : configService.get( 'TWITTER_REDIRECT_URL' ),
            passReqToCallback       : true,
            includeEmail            : true,
            includeEntities         : true,
            skipExtendedUserProfile : false,
        } );
    }

    /***/ 
    async validate(
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: ( error: any, user?: any ) => void,
    ): Promise<any> {
        const user: any = {
            id        : profile.id,
            email     : '',
            firstName : profile.displayName,
            lastName  : '',
            accessToken,
        };
        if ( profile.emails ) {
            user.email = profile.emails.shift().value;
        }
        if ( profile.photos && profile.photos.length > 0 ) {
            user.photo = profile.photos.shift().value;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const payload = {
            user,
            accessToken,
        };
        done( null, user );
    }

}
