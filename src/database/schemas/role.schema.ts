import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRoles } from "../../static/enum/user-role.enum";
import { Organ } from "./organ.schema";
import * as mongoose from 'mongoose'

export type RoleSocument = Role & Document;

@Schema()
export class Role{

    @Prop()
    role: UserRoles;

    @Prop({
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organ'
    })
    organ: Organ;

}

export const RoleSchema = SchemaFactory.createForClass(Role);
