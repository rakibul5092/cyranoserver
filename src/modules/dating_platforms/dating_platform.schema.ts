import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { Document } from 'mongoose';
import { BaseSchema } from '../base/base-schema';

export type DatingPlatformsDocument = DatingPlatform & Document;

@Schema()
export class DatingPlatform extends BaseSchema {

    @ApiProperty()
    @Prop( { required: true } )
        name: string;

    @ApiProperty()
    @Prop( { required: true } )
        price: number;

    @ApiProperty()
    @Prop( { default: true } )
        active: boolean;

}
export const DatingPlatformsSchema = SchemaFactory.createForClass( DatingPlatform );
