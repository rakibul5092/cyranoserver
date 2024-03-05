import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { Document } from 'mongoose';
import { BaseSchema } from '../base/base-schema';

export type PersonalInterestDocument = PersonalInterest & Document;

@Schema()
export class PersonalInterest extends BaseSchema {

    @ApiProperty()
    @Prop( { required: true } )
        name: string;

    @ApiProperty()
    @Prop( { default: true } )
        active: boolean;

}
export const PersonalInterestSchema = SchemaFactory.createForClass( PersonalInterest );
