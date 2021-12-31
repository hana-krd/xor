import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Country } from './country.schema';
import * as mongoose from 'mongoose';
import { File } from './file.schema';
import { User } from './user.schema';

export type CharityDocument = Charity & Document;

@Schema({timestamps: true})
export class Charity {

    _id: mongoose.ObjectId;

    @Prop({
        required: true,
    })
    name: string;

    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    })
    founders: User[];

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    owner: User;

    @Prop()
    telephoneNumber: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
    })
    avatar: File;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
    })
    nationality: Country;

    //TODO add branches as sub document 

    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'UserRole' }
        ]
    })
    admins;


    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ]
    })
    members;


    //TODO we need to know about charities legal document
    // and their licenses
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'File' }
        ]
    })
    legalFiles: File[];

}

export const CharitySchema = SchemaFactory.createForClass(Charity);
