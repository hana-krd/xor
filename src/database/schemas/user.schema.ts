import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Country } from './country.schema';
import * as mongoose from 'mongoose';
import { Role } from './role.schema';
import { File } from './file.schema';

export type UserDocument = User & Document;

@Schema()
export class User {

    _id: mongoose.ObjectId;

    @Prop({
        required: true,
    })
    name: string;

    @Prop()
    middleName: string;

    @Prop({
        required: true,
    })
    family: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    })
    avatar: File;

    @Prop()
    mobile: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
    })
    nationality: Country;

    @Prop()
    nationalCode: string;

    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
        ]
    })
    roles: Role[];

    @Prop()
    income: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
