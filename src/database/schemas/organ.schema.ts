import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type OrganSocument = Organ & Document;

@Schema()
export class Organ{

    @Prop()
    role: string;

    @Prop({})
    organ: Organ;

}

export const OrganSchema = SchemaFactory.createForClass(Organ);
