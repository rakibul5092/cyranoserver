import { Logger, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3ManagerService {

    private s3: S3;

    /***/
    constructor( private configService: ConfigService ) {
        this.s3 = new S3( {
            accessKeyId     : this.configService.get( 'AWS_ACCESS_KEY_ID' ),
            secretAccessKey : this.configService.get( 'AWS_SECRET_ACCESS_KEY' )
        } );
    }

    /**
     *
     * @param Key
     * @param ContentType
     * @param Body
     * @param bucket
     */
    public async uploadObject( Key:string, ContentType:string, Body:any, bucket?:string ): Promise<any> {
        const params = {
            Bucket: bucket || this.configService.get( 'AWS_BUCKET_NAME' ),
            Key,
            Body,
            ContentType
        };
        return new Promise( ( resolve, reject ) => {
            this.s3.upload( params, ( err, data ) => {
                if ( err ) {
                    Logger.error( err );
                    reject( err.message );
                }
                resolve( data );
            } );
        } );
    }


    /**
     * delete file from s3
     *
     * @param Key is the file name
     * @param bucket
     * @returns {Promise}
     */
    public async deleteObject( Key, bucket?:string ): Promise<any>{
        return await this.s3.deleteObject( { Bucket: bucket || this.configService.get( 'AWS_BUCKET_NAME' ), Key } ).promise();
    }

}
