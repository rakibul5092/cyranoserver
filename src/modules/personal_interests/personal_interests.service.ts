import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../base/base.service';
import { PersonalInterest, PersonalInterestDocument } from './personal_interest.schema';

@Injectable()
export class PersonalInterestsService extends BaseService<PersonalInterestDocument, PersonalInterest> {

    /***/
    constructor(
        @InjectModel( PersonalInterest.name ) private personalinterestModel: Model<PersonalInterestDocument>
    ) {
        super( personalinterestModel );
    }

}
