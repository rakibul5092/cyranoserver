import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfidentialClientApplication, CryptoProvider } from '@azure/msal-node';
import { AuthorizationUrlRequest } from '@azure/msal-node/dist/request/AuthorizationUrlRequest';
import { AuthorizationCodeRequest } from '@azure/msal-node/dist/request/AuthorizationCodeRequest';
import { AuthenticationResult } from '@azure/msal-common';


@Injectable()
export class MicrosoftCalendarService {

    msalInstance: ConfidentialClientApplication;
    cryptoProvider = new CryptoProvider();
    scopes: [
        'https://graph.microsoft.com/.default',
        'https://graph.microsoft.com/Calendars.ReadWrite'
    ];

    constructor( private configService: ConfigService ) {
        this.msalInstance = new ConfidentialClientApplication( {
            auth: {
                clientId     : configService.get( 'MICROSOFT_CLIENT_ID' ),
                authority    : 'https://login.microsoftonline.com/common/',
                clientSecret : configService.get( 'MICROSOFT_CLIENT_SECRET' )
            },
        } );
    }


    /**
     * authorize ms clients
     */
    public async authorize(): Promise<string> {
        const csrfToken = this.cryptoProvider.createNewGuid();

        // Generate PKCE Codes before starting the authorization flow
        const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();

        const state = this.cryptoProvider.base64Encode(
            JSON.stringify( { csrfToken, redirectTo: '/', verifier } )
        );
        const authCodeUrlRequestParams = { state: state, scopes: this.scopes };

        // Set generated PKCE codes and method as session vars
        const pkceCodes = { challengeMethod: 'S256', verifier, challenge };
        const responseMode:any = 'form_post'
        const authCodeUrlRequest:AuthorizationUrlRequest = {
            redirectUri         : this.configService.get( 'MICROSOFT_REDIRECT_URL' ),
            responseMode,
            codeChallenge       : pkceCodes.challenge,
            codeChallengeMethod : pkceCodes.challengeMethod,
            ...authCodeUrlRequestParams,
        };
        try {
            return await this.msalInstance.getAuthCodeUrl( authCodeUrlRequest );
        } catch ( error ) {
            throw new HttpException( error, HttpStatus.INTERNAL_SERVER_ERROR );
        }
    }



    /**
     * get the user information after auth finished
     *
     * @param req
     */
    async getUserInfo( req ): Promise<{email: string, token: string, tokenVerifier: string}> {
        if ( !req.body.state ){
            throw new HttpException( 'No valid Microsoft state', HttpStatus.INTERNAL_SERVER_ERROR );
        }
        try {
            const state = JSON.parse( this.cryptoProvider.base64Decode( req.body.state ) );
            const authorizationCodeRequest: AuthorizationCodeRequest = {
                code         : req.body.code,
                scopes       : this.scopes,
                redirectUri  : this.configService.get( 'MICROSOFT_REDIRECT_URL' ),
                codeVerifier : state.verifier
            }
            const tokenResponse:AuthenticationResult = await this.msalInstance.acquireTokenByCode( authorizationCodeRequest );
            return { email: tokenResponse.account.username, token: req.body.code, tokenVerifier: state.verifier }
        } catch ( error ) {
            throw new HttpException( error, HttpStatus.INTERNAL_SERVER_ERROR );
        }
    }

}
