import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Unmatched, UnmatchedDocument } from './unmatched.schema';
import { BaseService } from '../base/base.service';
import { ExceptionsService } from '../shared/exceptions/exceptions.service';
import { CUSTOM_ERROR_CODES } from '../shared/exceptions/exceptions.errors';
import { PersonalInterest } from '../personal_interests/personal_interest.schema';
import { SMSService } from '../shared/sms/sms.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UnmatchedService extends BaseService<UnmatchedDocument, Unmatched> {

    /***/
    constructor(
        @InjectModel( Unmatched.name ) private unmatchedModel: Model<UnmatchedDocument>,
        private exceptionsService: ExceptionsService,
        private smsServive: SMSService,
        private authService: AuthService
    ) {
        super( unmatchedModel );
    }

    async registration( phoneNumber: string ): Promise<any> {
        const userToAttempt = await this.unmatchedModel.findOne( { phoneNumber } );

        if ( userToAttempt ) {
            try {
                if ( !userToAttempt?.verified ) {
                    userToAttempt.otp.code = '00000';
                    // await this.smsServive.sendSMS( phoneNumber );
                }
            } catch ( err ) {
                return Promise.resolve( { status: false, code: CUSTOM_ERROR_CODES.OTP_SEND_FAILED, message: err } );
            }

            userToAttempt.otp.retries += 1;
            return await userToAttempt.save();
        } else {
            return await this.unmatchedModel.create( {
                phoneNumber, otp: {
                    code    : '00000',
                    retries : 1
                }
            } );
        }
    }

    async resendOTP( phoneNumber: string ): Promise<any> {
        const userToAttempt = await this.unmatchedModel.findOne( { phoneNumber } );

        if ( userToAttempt ) {
            try {
                userToAttempt.otp.code = '00000';
                // await this.smsServive.sendSMS( phoneNumber );
            } catch ( err ) {
                return Promise.resolve( { status: false, code: CUSTOM_ERROR_CODES.OTP_SEND_FAILED, message: err } );
            }

            userToAttempt.otp.retries += 1;
            return await userToAttempt.save();
        } else {
            return Promise.resolve( { status: false, code: CUSTOM_ERROR_CODES.USER_NOT_FOUND } );
        }
    }

    async verifyOTP( phoneNumber: string, otp: string ): Promise<any> {
        const userToAttempt = await this.unmatchedModel.findOne( { phoneNumber } );
        if ( userToAttempt ) {
            try {
                const sms = await this.smsServive.varifyOTP( phoneNumber, otp );
                if ( sms.status === 'pending' ) {
                    return Promise.resolve( { status: false, code: CUSTOM_ERROR_CODES.OTP_NOT_VALID } )
                }
                if ( sms.status === 'approved' ) {
                    userToAttempt.verified = true;
                }
                return await this.unmatchedModel.findOneAndUpdate( { phoneNumber }, userToAttempt );
            } catch ( err ) {
                return Promise.resolve( { status: false, code: CUSTOM_ERROR_CODES.OTP_EXPIRED } )
            }
        } else {
            return this.exceptionsService.throwHttpCustomException( CUSTOM_ERROR_CODES.NOT_VALID_PASSWORD );
        }
    }

    override async update( id: string, data: any ): Promise<any> {
        return this.unmatchedModel.findByIdAndUpdate( id, data, { new: true } ).populate( "personalInterests" ).populate( "likes" ).populate( "disLikes" );
    }

    async findUsersforSwippingByGender( unmatched: Unmatched ): Promise<any> {
        const unmatcheds = await this.unmatchedModel.find( {
            $or: [
                { gender: { $in: [ unmatched.interestedIn ] }, firstName: { $ne: null } },
                { interestedIn: { $in: [ unmatched.gender, 'any' ] }, firstName: { $ne: null } },
                // TODO: need to get the following values and not just their dating preferences
                // { 'datingPreferences?.rack': { $in: [ unmatched.datingPreferences?.rack, ] } },
                // { 'datingPreferences?.ass': { $in: [ unmatched.datingPreferences?.ass, ] } },
                // { 'datingPreferences?.face': { $in: [ unmatched.datingPreferences?.face, ] } },
                // { 'datingPreferences?.ethinicity': { $in: [ unmatched.datingPreferences?.ethinicity, ] } },
                // { 'datingPreferences?.age': { $gt: unmatched.datingPreferences?.age, $lt: unmatched.datingPreferences?.age } },
                // { 'datingPreferences?.height': { $gt: unmatched.datingPreferences?.height, $lt: unmatched.datingPreferences?.height } },
                // { 'datingPreferences?.goals': { $gt: unmatched.datingPreferences?.goals, $lt: unmatched.datingPreferences?.goals } },
                // { 'datingPreferences?.interests': { $gt: unmatched.datingPreferences?.interests, $lt: unmatched.datingPreferences?.interests } },
            ]
        } ).populate( 'personalInterests' );
        return Promise.resolve( this.getPercentage( unmatcheds, unmatched.personalInterests ) )
    }

    getPercentage( users: Unmatched[], interest: PersonalInterest[] ): any {
        return users.map( ( user: Unmatched ) => {
            let percentage = 0;
            interest.forEach( ele => {
                const found = user.personalInterests.find( int => int.name === ele.name );
                if ( found ) {
                    percentage += 20;
                }
            } );
            return {
                user,
                matching_percentage: percentage
            }
        } );
    }

    async onLike( id: string, likeId: string ): Promise<Unmatched> {
        return await this.unmatchedModel.findOneAndUpdate( { _id: id }, { $push: { likes: likeId } }, { new: true } )
    }

    async onDisLike( id: string, disLikeId: string ): Promise<Unmatched> {
        return await this.unmatchedModel.findOneAndUpdate( { _id: id }, { $push: { disLikes: disLikeId } } )
    }

    async saveAccountDetails( id: string, unmatchedInfo: Unmatched ): Promise<any> {
        const accountAlreadyCreated = await this.findOne( { _id: id } );
        const userDetails = {
            firstName  : unmatchedInfo.firstName,
            lastName   : unmatchedInfo.lastName,
            email      : unmatchedInfo.email,
            phone      : unmatchedInfo.phoneNumber,
            password   : unmatchedInfo.password,
            inviteCode : null,
            unmatched  : id
        } ;
        
        let authResponse;

        if ( accountAlreadyCreated.email ) {
            authResponse = await this.authService.updateAccountDetails( accountAlreadyCreated.email, userDetails );
        } else {
            authResponse = await this.authService.register( userDetails );
        }

        const unmatchedInfoWithUpdatedUserDetails = await this.update( id, unmatchedInfo );
        return {
            ...authResponse,
            unmatched: unmatchedInfoWithUpdatedUserDetails
        };
    }

}
