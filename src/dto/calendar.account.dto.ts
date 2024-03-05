import { IsEmail, IsIn, IsNotEmpty } from "class-validator";
import { CalendarAccountEnum } from "../enums/calendar.account.enum";

export class CalendarAccountDto {

    _id?: string;

    @IsNotEmpty()
        userId: string;
    
    @IsIn( [ ...Object.values( CalendarAccountEnum ) ] )
        type: string;

    @IsEmail()
        email: string;
    
    token: string;

}
