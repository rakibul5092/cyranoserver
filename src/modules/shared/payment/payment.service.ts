import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { AppUtilsService } from "../utils/app.utils.service";
import { Stripe } from "stripe";
import { PaymentTokensModel } from "./models/payment.tokens.model";


@Injectable()
export class PaymentService {

    private client : Stripe
    private readonly clientConfig : Stripe.StripeConfig = {
        apiVersion : "2022-08-01", //default value provided by the stripe SDK
        typescript : true
    }

    /***/
    constructor( private appUtilsService: AppUtilsService, private configService: ConfigService ) {
        this.client = new Stripe( this.configService.get( 'STRIPE_SECRET_KEY' ), this.clientConfig );
    }

    /**
     * charge payment
     *
     * @param amount to charges
     * @param source A payment source to be charged. This can be the ID of a card
     * @param metadata meta info can be used for callback
     * @param currency
     */
    public async charges( amount: number, source, metadata?, currency: string = 'USD' ): Promise<Stripe.Response<Stripe.Charge>> {
        return this.client.charges.create( {
            amount: Math.round( amount * 100 ),
            currency,
            source,
            metadata
        } )
    }


    /**
     * generate tokens
     *
     * @param req is the token request Model
     */
    public async generateToken( req: PaymentTokensModel ): Promise<Stripe.Response<Stripe.Token>> {
        return this.client.tokens.create( {
            card: {
                number    : req.cardNumber,
                exp_month : req.expiry.month,
                exp_year  : req.expiry.year,
                cvc       : req.cvc
            }
        } )
    }

}
