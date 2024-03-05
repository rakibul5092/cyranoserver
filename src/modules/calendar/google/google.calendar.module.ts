import { Module } from '@nestjs/common';
import { GoogleCalendarService } from "./google.calendar.service";

@Module( {
    imports: [

    ],
    controllers : [] ,
    providers   : [ GoogleCalendarService ],
    exports     : [ GoogleCalendarService ],
} )
export class GoogleCalendarModule {}
