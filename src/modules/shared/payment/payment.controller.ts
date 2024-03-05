import { Body, Controller, InternalServerErrorException, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { PaymentService } from "./payment.service";
import { Public } from "../../auth/jwt/jwt.auth.guard";
import { AppUtilsService } from "../utils/app.utils.service";
import { PaymentChargeModel } from "./models/payment.charge.model";
import { PaymentTokensModel } from "./models/payment.tokens.model";

@Controller( 'payment' )
@Public()
@ApiBearerAuth()
@ApiTags( 'payment' )
@ApiConsumes( 'application/json' )
@ApiProduces( 'application/json' )
export class PaymentController {

    /***/
    constructor(
        private paymentService: PaymentService,
        private appUtilsService: AppUtilsService
    ) {}


    /**
     * charge payment API
     *
     * @param res http response
     * @param req payment request body
     */
    @Post( "/charges" ) 
    async charges( @Res() res, @Body() req: PaymentChargeModel ): Promise< void > {
        this.paymentService.charges( req.amount, req.source ).then( value => {
            res.json( { success: true, results: value } );
        } ).catch( ( error ) => {
            this.appUtilsService.logErrorMessage( error, 'error while charges payment' );
            throw new InternalServerErrorException( error.raw.message )
        } );
    }


    /**
     * create payment tokens API
     *
     * @param res http response
     * @param req payment request body
     */
    @Post( "/generate-token" )
    async generateToken( @Res() res, @Body() req: PaymentTokensModel ): Promise< void > {
        this.paymentService.generateToken( req ).then( value => {
            res.json( { success: true, results: value } );
        } ).catch( ( error ) => {
            this.appUtilsService.logErrorMessage( error, 'error while create payment token' );
            throw new InternalServerErrorException( error.raw.message )
        } );
    }

}
