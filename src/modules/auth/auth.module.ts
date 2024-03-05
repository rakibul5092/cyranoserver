import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { GoogleStrategy } from './strategies/google-strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { TwitterStrategy } from './strategies/twitter.strategy';
import { AuthSocialService } from './auth.social.service';
import { AppUtilsModule } from "../shared/utils/app.utils.module";
import { EmailModule } from "../shared/email/email.module";
import { AuthPasswordController } from "./auth.password.controller";

@Module( {
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync( {
            useFactory: ( config: ConfigService ) => {
                return {
                    secret      : config.get<string>( 'JWT_SECRET' ),
                    signOptions : {
                        expiresIn: config.get<string | number>( 'JWT_EXPIRES_IN' ),
                    },
                };
            },
            inject: [ ConfigService ],
        } ),
        AppUtilsModule,
        EmailModule
    ],
    controllers : [ AuthController, AuthPasswordController ],
    providers   : [
        AuthService,
        AuthSocialService,
        LocalStrategy,
        JwtStrategy,
        GoogleStrategy,
        FacebookStrategy,
        TwitterStrategy,
    ],
    exports: [ AuthService ],
} )
export class AuthModule {}
