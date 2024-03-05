import { Module } from '@nestjs/common';
import { AppUtilsService } from "./app.utils.service";


@Module( {
    imports     : [],
    controllers : [] ,
    providers   : [ AppUtilsService ],
    exports     : [ AppUtilsService ],
} )
export class AppUtilsModule {}
