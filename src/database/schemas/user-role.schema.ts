import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { OrganType } from '../../static/enum/organ-type.enum';
import { Roles } from '../../static/enum/role.enum';

export type UserRoleDocument = UserRole & Document;

@Schema({ timestamps: true })
export class UserRole {

    _id: mongoose.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user;

    @Prop({ type: mongoose.Schema.Types.ObjectId})
    organ: mongoose.ObjectId;

    @Prop({
        type: String,
        required: true,
        enum: Object.values(OrganType),
        default: OrganType.CHARITY
    })
    organType: OrganType;

    @Prop()
    roles: Roles[];
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
