import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';

export type FamilyDocument = Family & Document;

@Schema({ timestamps: true })
export class Family {

    _id: mongoose.Schema.Types.ObjectId;

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
    members:string[];

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