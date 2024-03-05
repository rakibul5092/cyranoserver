import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { Users } from '../users/users.schema';
import { AuthResponseModel } from './auth.response.model';

@Injectable()
export class AuthSocialService {

    /***/
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    /**
     * Register user
     *
     * @param providerId
     * @param socialUser
     */
    async register( providerId: string, socialUser: any ): Promise<Users> {
        const newUser = new Users();
        newUser.firstName = socialUser.firstName;
        newUser.lastName =  socialUser.lastName ?? ''
        newUser.email = socialUser.email;
        newUser.avatar = socialUser.photo;
        newUser[providerId] = socialUser.id;
        await this.usersService.save( newUser );
        return newUser;
    }


    /***/
    async login( username: string, userData: any ): Promise<AuthResponseModel> {
        const payload = { username: username, sub: userData._id };
        return {
            access_token : this.jwtService.sign( payload ),
            user         : userData,
        };
    }



    /**
     * Social sign in
     *
     * @param provider
     * @param data
     */
    async signInSocial( provider, data ): Promise<AuthResponseModel> {
        if ( !data.user && !data.user.userInfo ) throw new BadRequestException();

        const socialUser = data.user.userInfo || data.user;
        let providerId;
        let socialQuery;
        switch ( provider ) {
            case 'google': {
                providerId = 'googleId';
                socialQuery = { googleId: socialUser.id };
                break;
            }
            case 'facebook': {
                providerId = 'facebookId';
                socialQuery = { facebookId: socialUser.id };
                break;
            }
            case 'twitter': {
                socialUser.firstName = socialUser.firstName.trim();
                const nameString = socialUser.firstName.split( ' ' );

                if ( nameString.length > 1 ) {
                    socialUser.lastName = nameString.pop();
                    socialUser.firstName = nameString.join( ' ' );
                }

                providerId = 'twitterId';
                socialQuery = { twitterId: socialUser.id };
                break;
            }
        }
        let user = await this.usersService.findOne( socialQuery );
        if ( user ) return this.login( socialUser.id, user );

        if ( socialUser.email ) {
            user = await this.usersService.findOne( { email: socialUser.email } );
            if ( user ) {
                Logger.log(
                    `User ${socialUser.firstName} exists, but 
        ${provider} account was not connected to user's account`,
                    'Social Login',
                );
                user[providerId] = socialUser.id;
                await this.usersService.update( user._id, user );
                return this.login( socialUser.id, user );
            }
        }
        try {
            const newUser = await this.register( providerId, socialUser );
            return this.login( socialUser.id, newUser );
        } catch ( e ) {
            throw new Error( e );
        }
    }

}
