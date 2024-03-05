import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class S3FileRequestModel {

    @ApiProperty()
    @IsNotEmpty()
        filename: string

}
