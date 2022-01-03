import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Country } from './country.schema';
import * as mongoose from 'mongoose';
import { File } from './file.schema';
import { ExtraInfo } from '../../common/model/user-extra-info.model';

export type UserDocument = User & Document;


@Schema({ timestamps: true })
export class User {

    _id;

    @Prop({
        required: false,
    })
    name: string;

    @Prop()
    middleName: string;

    @Prop({
        required: false,
    })
    family: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    })
    avatar;

    @Prop()
    mobile: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
    })
    nationality;

    @Prop()
    nationalCode: string;

    @Prop()
    income: number;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    salt: string;

    @Prop()
    extraInfo: ExtraInfo;

}


export const UserSchema = SchemaFactory.createForClass(User);
