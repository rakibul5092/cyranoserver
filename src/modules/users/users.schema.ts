import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { Document, Schema as MongooseSchema  } from 'mongoose';
import { BaseSchema } from '../base/base-schema';

export type UsersDocument = Users & Document;

@Schema()
export class Users extends BaseSchema {

    @ApiProperty()
    @Prop( { required: true } )
        firstName: string;

    @ApiProperty()
    @Prop()
        lastName: string;

    @ApiProperty()
    @Prop()
        email: string;

    @ApiProperty()
    @Prop()
        password: string;

    @ApiProperty()
    @Prop()
        googleId: string;

    @ApiProperty()
    @Prop()
        facebookId: string;

    @ApiProperty()
    @Prop( { type: {} } )
        phone: any;

    @ApiProperty()
    @Prop()
        avatar: string;

    @ApiProperty()
        inviteCode: string;

    @ApiProperty()
    @Prop()
        twitterId: string;

    @ApiProperty()
    @Prop( { type: MongooseSchema.Types.ObjectId, ref: 'Unmatched', autopopulate: true } )
        unmatched: string;

    @ApiProperty()
    @Prop( raw( {
        code      : { type: String },
        resetDate : { type: Date },
        verified  : { type: Boolean },
        retries   : { type: Number }
    } ) )
        resetPassword: Record<string, any>;

}
export const UsersSchema = SchemaFactory.createForClass( Users );
