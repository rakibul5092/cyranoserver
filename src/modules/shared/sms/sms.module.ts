import { Module } from '@nestjs/common';
import { AppUtilsModule } from "../utils/app.utils.module";
import { SMSService } from "./sms.service";
import { SMSController } from "./sms.controller";


@Module( {
    imports     : [ AppUtilsModule ],
    controllers : [ SMSController ],
    providers   : [ SMSService ],
    exports     : [ SMSService ],
} )
export class SMSModule { }
