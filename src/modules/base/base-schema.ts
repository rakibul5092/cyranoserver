import { Prop } from '@nestjs/mongoose';

export class BaseSchema {

    @Prop() id: string;

    @Prop( { default: new Date() } )
        createdAt?: Date;

    @Prop()
        updatedAt?: Date;

}
