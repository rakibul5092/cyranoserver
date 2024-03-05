import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { Document } from 'mongoose';
import { BaseSchema } from '../base/base-schema';

export type CalendarDocument = Calendar & Document;

@Schema()
export class Calendar extends BaseSchema {

    @ApiProperty()
    @Prop( { required: true } )

        userId: string;

}
export const CalendarSchema = SchemaFactory.createForClass( Calendar );
