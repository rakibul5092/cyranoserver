import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class AuthRegisterModel {

    @ApiProperty()
    @IsNotEmpty()
        firstName: string;

    @ApiProperty()
    @IsNotEmpty()
        lastName: string;

    @ApiProperty()
    @IsNotEmpty()
        email: string;

    @ApiProperty()
    @IsNotEmpty()
        password: string;

    @ApiProperty()
    @IsNotEmpty()
        phone: any;

    @ApiProperty()
    @IsNotEmpty()
        inviteCode: string;

    @ApiProperty()
    @Prop( { type: MongooseSchema.Types.ObjectId, ref: 'Unmatched', autopopulate: true } )
        unmatched: string;

}
