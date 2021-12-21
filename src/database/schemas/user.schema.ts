import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Country } from './country.schema';
import * as mongoose from 'mongoose';
import { Role } from './role.schema';

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
    })
    nanionality: Country;

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
