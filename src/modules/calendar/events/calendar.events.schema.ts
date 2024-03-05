import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { HydratedDocument } from 'mongoose';
import { BaseSchema } from '../../base/base-schema';
import { IsNotEmpty } from "class-validator";

export type CalendarEventDocument = HydratedDocument<CalendarEvent>;

@Schema( {
    collection: 'calendar_event'
} )
export class CalendarEvent extends BaseSchema {

    @ApiProperty()
    @Prop( { required: true } ) 
        userId: string;

    @ApiProperty()
    @IsNotEmpty()
    @Prop( { required: true } )
        title: string;

    @ApiProperty()
    @Prop( { required: true } )
        allDay: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @Prop( { required: true } )
        startDate: string;

    @ApiProperty()
    @IsNotEmpty()
    @Prop( { required: true } )
        startTime: string;

    @ApiProperty()
    @IsNotEmpty()
    @Prop( { required: true } )
        endDate: string;

    @ApiProperty()
    @IsNotEmpty()
    @Prop( { required: true } )
        endTime: string;

    @ApiProperty()
    @Prop()
        note: string;

}
export const CalendarEventSchema = SchemaFactory.createForClass( CalendarEvent );
