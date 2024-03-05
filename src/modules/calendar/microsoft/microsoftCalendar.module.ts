import { Module } from '@nestjs/common';
import { MicrosoftCalendarService } from "./microsoft-calendar.service";

@Module( {
    imports: [
    ],
    controllers : [] ,
    providers   : [ MicrosoftCalendarService ],
    exports     : [ MicrosoftCalendarService ],
} )
export class MicrosoftCalendarModule {}
