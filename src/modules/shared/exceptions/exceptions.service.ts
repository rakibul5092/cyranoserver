import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ExceptionType } from "./exceptions.errors";

@Injectable()
export class ExceptionsService {

    /**
     * throw a give custom http exception
     *
     * @param errorType
     * @param error is the catch error object
     */
    public throwHttpCustomException( errorType: ExceptionType, error? ): void {
        Logger.error( error );
        Logger.error( errorType );
        throw new HttpException(
            { 
                statusCode : errorType.statusCode,
                message    : errorType.message
            },
            errorType.httpStatus
        );
    }

}
