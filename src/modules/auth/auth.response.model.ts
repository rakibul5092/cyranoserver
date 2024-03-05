import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Unmatched } from '../unmatched/unmatched.schema';
import { Users } from '../users/users.schema';

export class AuthResponseModel {

    @ApiProperty()
    @IsNotEmpty()
        access_token: string;

    @ApiProperty()
    @IsNotEmpty()
        user: Users;

    @ApiProperty()
        unmatched?: Unmatched;

}
