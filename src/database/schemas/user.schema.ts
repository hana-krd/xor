import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Country } from "./country.schema";

export type UserDocument = User & Document;

@Schema()
export class User{

    @Prop({
        required: true
    })
    name: string;

    @Prop()
    middleName: string;
    
    @Prop({
        required: true
    })
    family: string;

    @Prop()
    avatar: string;

    @Prop()
    mobile: string;

    @Prop()
    nanionality: Country;

    @Prop()
    nationalCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);