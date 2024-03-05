import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '../../base/base.service';
import { CalendarAccount, CalendarAccountDocument } from "./calendar.accounts.schema";

@Injectable()
export class CalendarAccountsService extends BaseService<CalendarAccountDocument, CalendarAccount> {

    /***/
    constructor(
        @InjectModel( CalendarAccount.name ) private calendarAccountModel: Model<CalendarAccountDocument>,
    ) {
        super( calendarAccountModel );
    }

}
