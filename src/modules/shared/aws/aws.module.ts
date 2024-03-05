import { Module } from '@nestjs/common';
import { S3ManagerService } from './s3/s3-manager.service';
import { S3Controller } from "./s3/s3.controller";
import { SharpService } from "./sharp.service";
import { AppUtilsModule } from "../utils/app.utils.module";


@Module( {
    imports     : [ AppUtilsModule ],
    controllers : [ S3Controller ],
    providers   : [ S3ManagerService, SharpService ],
    exports     : [ S3ManagerService, SharpService ],
} )
export class AwsModule {}
