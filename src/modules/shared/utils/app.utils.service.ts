import { Injectable, Logger } from "@nestjs/common";


@Injectable()
export class AppUtilsService{

    /**
     * generate random string
     *
     * @param length
     * @param onlyNumbers
     */
    public randomCode ( length, onlyNumbers?:boolean ): string {
        let result           = '';
        const characters       = onlyNumbers ? '123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt( Math.floor( Math.random() *
                charactersLength ) );
        }
        return result;
    }

    /**
     * get format file size
     *
     * @param size
     */
    public fileSize( size ): string {
        const i = Math.floor( Math.log( size ) / Math.log( 1024 ) );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return ( size / Math.pow( 1024, i ) ).toFixed( 2 ) * 1 + ' ' + [ 'B',
            'kB',
            'MB',
            'GB',
            'TB' ][i];
    }

    /***/
    public logErrorMessage( error, message: string ): void {
        Logger.error( message );
        Logger.error( error );
    }


    /**
     * check if date less than some hours ago
     *
     * @param date
     * @param hours
     */
    public lessThanHoursAgo ( date: Date, hours:number = 1 ): boolean {
        const HOUR = 1000 * 60 * ( 60*hours );
        const anHourAgo: number = Date.now() - HOUR;
        return date >= new Date( anHourAgo );
    }

}
