import { Body, Controller, Delete, Post, Res } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/modules/auth/jwt/jwt.auth.guard';
import { AppUtilsService } from "../../utils/app.utils.service";
import { S3FileRequestModel } from "../models/s3.file.request.model";
import { S3RequestModel } from "../models/s3.request.model";
import { SharpService } from "../sharp.service";
import { S3ManagerService } from "./s3-manager.service";

@Controller( 'aws/s3' )
@Public()

//TO DO
// @ApiBearerAuth()
@ApiTags( 'aws' )
@ApiConsumes( 'application/json' )
@ApiProduces( 'application/json' )
export class S3Controller {

    /***/
    constructor( private s3Service: S3ManagerService,
        private appUtilsService: AppUtilsService,
        private sharpService: SharpService ) { }


    /***/
    @Post( "/upload" )
    async upload( @Body() request: S3RequestModel, @Res() res ): Promise<any> {
        const errors = [];
        const result = [];
        for ( const file of request.files ) {
            try {
                const randomFileName = `${this.appUtilsService.randomCode( 5 )}_${file.name}`;
                const progressiveContent = await this.sharpService.compressProgressive( file.content, file.type );
                await this.s3Service.uploadObject( randomFileName, file.type, progressiveContent );
                result.push( { url: randomFileName } );
            } catch ( e ) {
                this.appUtilsService.logErrorMessage( e, 'error while compress or upload the files : ' );
                errors.push( { success: false, file: file.name } );
            }
        }
        errors.length === 0 ? res.send( result ) : res.status( 500 ).send( errors );
    }


    /***/
    @Delete( "/delete" )
    async delete( @Body() request: S3FileRequestModel, @Res() res ): Promise<any> {
        try {
            await this.s3Service.deleteObject( request.filename );
            res.json( { success: true } );
        } catch ( e ) {
            this.appUtilsService.logErrorMessage( e, 'error while delete file from s3 : ' );
            res.json( { success: false } );
        }
    }


    /***/
    @Delete( "/delete/bulk" )
    async deleteBulk( @Body() request: S3FileRequestModel[], @Res() res ): Promise<any> {
        try {
            for ( const requestItem of request ) {
                await this.s3Service.deleteObject( requestItem.filename );
            }
            res.json( { success: true } );
        } catch ( e ) {
            this.appUtilsService.logErrorMessage( e, 'error while delete bulk files from s3 : ' );
            res.json( { success: false } );
        }
    }

}
