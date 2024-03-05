import { Schema } from "@nestjs/mongoose";
import { BaseSchema } from "src/modules/base/base-schema";

export class Itinerary {

}


@Schema()
export class FreeSlotSchema extends BaseSchema {

    dayOfWeek: number;
    startDate: Date;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    itinerary?: Itinerary;
    location?: string;

}
