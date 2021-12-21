import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import * as mongoose from 'mongoose';

export type FamilyDocument = Family & Document;

export class Family {

    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    })
    members: User[];

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USer'
    })
    head: User;

}

export const FamilySchema = SchemaFactory.createForClass(Family);