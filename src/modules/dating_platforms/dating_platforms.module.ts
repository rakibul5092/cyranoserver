import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatingPlatform, DatingPlatformsSchema } from './dating_platform.schema';
import { DatingPlatformsController } from './dating_platforms.controller';
import { DatingPlatformsService } from './dating_platforms.service';


@Module( {
    imports: [
        MongooseModule.forFeature( [ { name: DatingPlatform.name, schema: DatingPlatformsSchema } ] ),
    ],
    controllers : [ DatingPlatformsController ],
    providers   : [ DatingPlatformsService ],
    exports     : [ DatingPlatformsService ],
} )

export class DatingPlatformsModule {}
