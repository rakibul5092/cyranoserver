import { Injectable } from "@nestjs/common";
import * as sharp from "sharp";
import * as buffer from "buffer";

@Injectable()
export class SharpService{

    /**
     * @param content 
     * @param type 
     * @returns 
     */
    public async compressProgressive( content, type ): Promise<any> {
        const Buffer = buffer.Buffer;
        switch ( type ) {
            case 'image/jpeg': {
                return await sharp( Buffer.from( content, 'base64' ) )
                    .jpeg( { quality: 50, progressive: true, force: true, optimiseScans: true, mozjpeg: true } )
                    .toBuffer();
            }
            case 'image/png': {
                return await sharp( Buffer.from( content, 'base64' ) )
                    .png( { quality: 50, progressive: true, force: true } )
                    .toBuffer();
            }
            case 'image/webp': {
                return await sharp( Buffer.from( content, 'base64' ) )
                    .webp( { quality: 50, progressive: true, force: true, lossless: true } )
                    .toFormat( 'webp' )
                    .toBuffer();
            }
        }
    }

}
