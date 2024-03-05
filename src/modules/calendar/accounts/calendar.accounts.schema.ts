import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { HydratedDocument } from 'mongoose';
import { BaseSchema } from '../../base/base-schema';
import { CalendarAccountEnum } from "../../../enums/calendar.account.enum";

export type CalendarAccountDocument = HydratedDocument<CalendarAccount>;

@Schema( {
    collection: 'calendar_account'
} )
export class CalendarAccount extends BaseSchema {

    @ApiProperty()
    @Prop( { required: true } ) 
        userId: string;

    @ApiProperty()
    @Prop( { required: true, enum: CalendarAccountEnum } )
        type: string;

    @ApiProperty()
    @Prop( { unique: true, required: true, email: true } )
        email: string;  
    
    @ApiProperty()
    @Prop()
        active: boolean;

    @ApiProperty()
    @Prop()
        token: string;


    @ApiProperty()
    @Prop()
        tokenVerifier?: string;

    @Prop( raw( {
        backgroundColor : { type: String },
        foregroundColor : { type: String },
        borderColor     : { type: String },
    } ) )
        theme: Record<string, any>;

}

export const CalendarAccountSchema = SchemaFactory.createForClass( CalendarAccount );
