import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Currency } from "./currency.schema";

export type CountryDocument = Country & Document;

@Schema()
export class Country{
    @Prop()
    name: string;

    @Prop()
    language: string;

    @Prop()
    currency: Currency;

}

export const CountrySchema = SchemaFactory.createForClass(Country);