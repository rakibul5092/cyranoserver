import { Module } from '@nestjs/common';
import { AppUtilsModule } from "../utils/app.utils.module";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";


@Module( {
    imports     : [ AppUtilsModule ],
    controllers : [ PaymentController ],
    providers   : [ PaymentService ],
    exports     : [ PaymentService ],
} )
export class PaymentModule { }
