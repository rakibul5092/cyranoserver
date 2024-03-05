import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsPositive } from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";
import { BaseSchema } from "src/modules/base/base-schema";

export type WeeklyRoutineEventDocument = HydratedDocument<WeeklyRoutineEvent>;

@Schema()
export class WeeklyRoutineEvent extends BaseSchema{

    _id: mongoose.Schema.Types.ObjectId;

    @Prop()
        userId: string;

    @Prop()
    @IsNotEmpty()
        title: string;

    @Prop()
    @IsNotEmpty()
        startDate: Date;

    @Prop()
    @IsNotEmpty()
        endDate: Date;

    @Prop()
    @IsNotEmpty()
        startTime: string;

    @Prop()
    @IsNotEmpty()
        endTime: string;

    @Prop()
    @IsNotEmpty()
    @IsPositive()
        startHour: number;

    @Prop()
    @IsNotEmpty()
    @IsPositive()
        startMinute: number;

    @Prop()
    @IsNotEmpty()
    @IsPositive()
        endHour: number;

    @Prop()
    @IsNotEmpty()
    @IsPositive()
        endMinute: number;

    @Prop()
    @IsNotEmpty()
    @IsPositive()
        dayOfWeek: number;
    
    @Prop()
    @IsNotEmpty()
        meridian: 'am' | 'pm' | 'AM' | 'PM';

}

export const WeeklyRoutineSchema = SchemaFactory.createForClass( WeeklyRoutineEvent )
