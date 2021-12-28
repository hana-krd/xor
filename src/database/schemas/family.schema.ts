import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import * as mongoose from 'mongoose';

export type FamilyDocument = Family & Document;
@Schema()
export class Family {

    @Prop()
    name: string;
        
    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    })
    members;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    head: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    creator: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Charity'
    })
    charity: string;

}

export const FamilySchema = SchemaFactory.createForClass(Family);