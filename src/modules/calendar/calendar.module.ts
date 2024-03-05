import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CalendarService } from './calendar.service';
import { Calendar, CalendarSchema } from './calendar.schema';
import { CalendarController } from "./calendar.controller";
import { CalendarEventsService } from "./events/calendar.events.service";
import { CalendarEventController } from "./events/calendar.events.controller";
import { CalendarEvent, CalendarEventSchema } from "./events/calendar.events.schema";
import { CalendarAccount, CalendarAccountSchema } from "./accounts/calendar.accounts.schema";
import { CalendarAccountController } from "./accounts/calendar.accounts.controller";
import { CalendarAccountsService } from "./accounts/calendar.accounts.service";
import { GoogleCalendarModule } from "./google/google.calendar.module";
import { MicrosoftCalendarModule } from './microsoft/microsoftCalendar.module';

@Module( {
    imports: [
        MongooseModule.forFeature( [
            { name: Calendar.name, schema: CalendarSchema },
            { name: CalendarEvent.name, schema: CalendarEventSchema },
            { name: CalendarAccount.name, schema: CalendarAccountSchema }
        ] ),
        GoogleCalendarModule,
        MicrosoftCalendarModule
    ],
    controllers : [ CalendarController, CalendarEventController, CalendarAccountController ],
    providers   : [ CalendarService, CalendarEventsService, CalendarAccountsService ],
    exports     : [ CalendarService, CalendarEventsService, CalendarAccountsService ],
} )
export class CalendarModule {}
