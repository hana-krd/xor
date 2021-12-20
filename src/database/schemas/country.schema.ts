import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Currency } from "./currency.schema";

export type CountryDocument = Country & Document;

@Schema()
export class Country {
    @Prop()
    name: string;

    @Prop()
    language: string;

    @Prop({ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Currency'
     })
    currency: Currency;

}

export const CountrySchema = SchemaFactory.createForClass(Country);