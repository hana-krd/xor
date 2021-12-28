import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from 'mongoose'
import { User } from "./user.schema";

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {

    _id: mongoose.ObjectId;
    
    @Prop()
    name: string;

    @Prop()
    originalName: string;

    @Prop()
    type: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    owner: User;
}

export const FileSchema = SchemaFactory.createForClass(File);