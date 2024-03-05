import { Global, Module } from '@nestjs/common';
import { AppUtilsModule } from '../utils/app.utils.module';
import { ExceptionsService } from "./exceptions.service";



@Global()
@Module( {
    imports     : [ AppUtilsModule ],
    controllers : [ ] ,
    providers   : [ ExceptionsService ],
    exports     : [ ExceptionsService ],
} )
export class ExceptionsModule { }
