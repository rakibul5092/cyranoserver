import { IsEmail, IsIn, IsNotEmpty } from "class-validator";
import { CalendarAccountEnum } from "../enums/calendar.account.enum";

export class CalendarEventDto {

    userId?: string;
    note?: string;
    allDay?: boolean;
    _id?: string;
    
    accountId?: string;

    @IsNotEmpty()
        title: string;

    @IsNotEmpty()
        startDate: string;

    @IsNotEmpty()
        startTime: string;

    @IsNotEmpty()
        endDate: string;

    @IsNotEmpty()
        endTime: string;

    @IsEmail()
        email?: string;

    @IsIn( [ ...Object.values( CalendarAccountEnum ) ] )
        type: string;

}
