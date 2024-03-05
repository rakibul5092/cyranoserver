import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { ResponseModel } from "./models/response.model";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

    /**
     * Catch and prepare the response for exception
     *
     * @param exception
     * @param host
     */
    catch( exception: HttpException, host: ArgumentsHost ): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const { status, json } = this.prepareException( exception );

        response.status( status ).send(
            new ResponseModel( false, json )
        );
    }

    /**
     * Prepare the exception response object
     *
     * @param exc
     */
    prepareException( exc ): { status: number; json: object } {
        if ( process.env.NODE_ENV !== 'test' ) {
            Logger.error( exc, 'PREPARE Exception' );
        }
        const error = exc instanceof HttpException ? exc : new InternalServerErrorException( exc.message );
        const status = error.getStatus();
        const response = error.getResponse();
        const json = typeof response === 'string' ? { error: response } : response;
        return { status, json };
    }

}
