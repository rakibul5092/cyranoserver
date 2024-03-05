import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { ResponseModel } from "../models/response.model";
import { CUSTOM_ERROR_CODES } from "./exceptions.errors";

@Catch( MongoError )
export class MongoExceptionFilter implements ExceptionFilter {

    catch( exception: MongoError, host: ArgumentsHost ): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        switch ( exception.code ) {
            // duplicate exception
            case 11000: {
                response.status( CUSTOM_ERROR_CODES.DUPLICATE_FIELD.httpStatus ).send(
                    new ResponseModel( false, {
                        fieldName: exception['keyPattern'] ? Object.keys( exception['keyPattern'] )[0] : null,
                        ...CUSTOM_ERROR_CODES.DUPLICATE_FIELD
                    } )
                );
            }
        }
    }

}
