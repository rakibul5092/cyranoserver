import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '../../base/base.service';
import { CalendarEvent, CalendarEventDocument } from "./calendar.events.schema";

@Injectable()
export class CalendarEventsService extends BaseService<CalendarEventDocument, CalendarEvent> {

    /***/
    constructor(
        @InjectModel( CalendarEvent.name ) private calendarEventModel: Model<CalendarEventDocument>,
    ) {
        super( calendarEventModel );
    }

}
