import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type CurrencyDocument = Currency & Document;

@Schema({ timestamps: true })
export class Currency{
    @Prop()
    iso: string;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);