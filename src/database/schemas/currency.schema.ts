import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type CurrencyDocument = Currency & Document;

@Schema()
export class Currency{
    @Prop()
    iso: string;

}

export const CountrySchema = SchemaFactory.createForClass(Currency);