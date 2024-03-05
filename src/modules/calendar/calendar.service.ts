import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Calendar, CalendarDocument } from './calendar.schema';
import { BaseService } from '../base/base.service';

@Injectable()
export class CalendarService extends BaseService<CalendarDocument, Calendar> {

    /***/
    constructor(
        @InjectModel( Calendar.name ) private calendarModel: Model<CalendarDocument>,
    ) {
        super( calendarModel );
    }

}
