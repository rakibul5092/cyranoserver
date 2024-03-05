import { ApiProperty } from '@nestjs/swagger';

export class ResponseModel {

    @ApiProperty()
        success: boolean;

    @ApiProperty()
        data: never | never[]


    /***/
    constructor ( success: boolean = true, data?: any | any[] ) {
        this.success = success;
        this.data = data;
    }

}
