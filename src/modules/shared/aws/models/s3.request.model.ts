import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class S3RequestModel {

    @ApiProperty()
    @IsNotEmpty()
        files: any[]

}
