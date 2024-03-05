import { Module } from '@nestjs/common';
import { AppUtilsModule } from '../utils/app.utils.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';


@Module( {
    imports     : [ AppUtilsModule ],
    controllers : [ EmailController ],
    providers   : [ EmailService ],
    exports     : [ EmailService ],
} )
export class EmailModule { }
