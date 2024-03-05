import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordModel {

    @ApiProperty()
        email: string;

    @ApiProperty()
        code: string;

    @ApiProperty()
        password: string;

}
