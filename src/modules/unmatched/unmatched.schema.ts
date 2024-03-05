import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { Document, Schema as MongooseSchema } from 'mongoose';
import { BaseSchema } from '../base/base-schema';
import { DatingPlatform } from '../dating_platforms/dating_platform.schema';
import { PersonalInterest } from '../personal_interests/personal_interest.schema';
export type UnmatchedDocument = Unmatched & Document;

@Schema()
export class Unmatched extends BaseSchema {

    _id?: MongooseSchema.Types.ObjectId;

    @ApiProperty()
    @Prop( { required: true } )
        phoneNumber: string;

    @ApiProperty()
    @Prop()
        firstName: string;

    @ApiProperty()
    @Prop()
        lastName: string;

    @ApiProperty()
    @Prop()
        profession: string;

    @ApiProperty()
    @Prop()
        distance: string;

    @ApiProperty()
    @Prop( raw( {
        addressLine1 : { type: String },
        addressLine2 : { type: String }
    } ) )
        address: Record<string, string>

    @ApiProperty()
    @Prop()
        email: string;

    @ApiProperty()
    @Prop()
        password: string;

    @ApiProperty()
    @Prop()
        birthDate: string;

    @ApiProperty()
    @Prop()
        about: string;

    @ApiProperty()
    @Prop( {
        type: {
            lat  : Number,
            long : Number
        }
    } )
        location: {
        lat: number,
        long: number
    };

    @ApiProperty()
    @Prop( { enum: [ 'man', 'woman', 'other', 'any' ] } )
        gender: string;

    @ApiProperty()
    @Prop( { enum: [ 'man', 'woman', 'other', 'any' ] } )
        interestedIn: string;

    @ApiProperty()
    @Prop()
        verified: boolean;

    @ApiProperty()
    @Prop()
        acceptedConditions: boolean;
    
    @ApiProperty()
    @Prop()
        initiatedSummarySection: boolean;
    
    @ApiProperty()
    @Prop()
        initiatedCalendarSetup: boolean;

    @ApiProperty()
    @Prop()
        initiatedSendRequestFlow: boolean;

    @ApiProperty()
    @Prop( )
        lastActiveRoute: string;

    @ApiProperty()
    @Prop()
        rewardedInAppCurrency: boolean;

    @ApiProperty()
    @Prop( [ { type: MongooseSchema.Types.ObjectId, ref: 'PersonalInterest', autopopulate: true } ] )
        personalInterests: PersonalInterest[];

    @ApiProperty()
    @Prop( [ { type: MongooseSchema.Types.ObjectId, ref: 'DatingPlatform', autopopulate: true } ] )
        datingPlatforms: DatingPlatform[];

    @ApiProperty()
    @Prop( raw( [ {
        accountAlreadyExists : { type: Boolean },
        password             : { type: String }
    } ] ) )
        datingPlatformsInfo: Record<string, any>;

    @ApiProperty()
    @Prop( raw( {
        usingExistingPhoneNumber : { type: Boolean },
        noOtherAccountExists     : { type: Boolean },
        phoneNumber              : { type: String }, 
        pricePlan                : { type: String }
    } ) )
        datingAccountPhoneNumberDetails: Record<string, any>;

    @ApiProperty()
    @Prop()
        images: string[];

    @ApiProperty()
    @Prop( raw( {
        code    : { type: String },
        retries : { type: Number, default: 0 }
    } ) )
        otp: Record<string, any>;

    @ApiProperty()
    @Prop( raw( {
        rack       : [ { type: String } ],
        ass        : [ { type: String } ],
        face       : { type: Number },
        ethinicity : [ { type: String } ],
        age        : {
            type: {
                min : { type: String },
                max : { type: String }
            }
        },
        height: {
            type: {
                min : { type: String },
                max : { type: String }
            }
        },
        friends        : { type: Boolean },
        purposeNotSure : { type: Boolean },
        relationships  : { type: Boolean },
        interests      : { type: Number },
    } ) )
        datingPreferences: Record<string, any>;

    @ApiProperty()
    @Prop( [ { type: MongooseSchema.Types.ObjectId, ref: 'Unmatched', autopopulate: true } ] )
        likes: Unmatched[];

    @ApiProperty()
    @Prop( [ { type: MongooseSchema.Types.ObjectId, ref: 'Unmatched', autopopulate: true } ] )
        disLikes: Unmatched[];

    @ApiProperty()
    @Prop( raw( {
        owner: {
            firstName : { type: String },
            lastName  : { type: String },
        },
        cardNumber : { type: String },
        expiry     : {
            month : { type: String },
            year  : { type: String },
        },
        cvc     : { type: String },
        default : { type: Boolean },
        type    : { type: String, enum: [ 'mastercard', 'visa', 'americanExpress' ] }
    } ) )
        cardDetails: Record<string, any>;

}
export const UnmatchedSchema = SchemaFactory.createForClass( Unmatched );
