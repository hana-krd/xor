import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Country } from './country.schema';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
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

    @Prop()
    avatar: string;

    @Prop()
    mobile: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        default: '61c05a008881f3c4e716b17b'
    })
    nanionality: Country;

    @Prop()
    nationalCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
