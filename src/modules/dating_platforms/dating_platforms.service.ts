import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '../base/base.service';
import { DatingPlatform, DatingPlatformsDocument } from './dating_platform.schema';

@Injectable()
export class DatingPlatformsService extends BaseService<DatingPlatformsDocument, DatingPlatform> {

    /***/
    constructor(
        @InjectModel( DatingPlatform.name ) private userModel: Model<DatingPlatformsDocument>,
    ) {
        super( userModel );
    }

}
