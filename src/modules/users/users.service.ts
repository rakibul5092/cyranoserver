import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './users.schema';
import { BaseService } from '../base/base.service';

@Injectable()
export class UsersService extends BaseService<UsersDocument, Users> {

    /***/
    constructor(
        @InjectModel( Users.name ) private userModel: Model<UsersDocument>,
    ) {
        super( userModel );
    }

}
