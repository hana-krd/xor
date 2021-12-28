import { IsNotEmpty, IsString } from "class-validator";

export class CreateFamilyDto{

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    members: string[];

    @IsNotEmpty()
    head: string;

    @IsNotEmpty()
    charity: string;

    @IsNotEmpty()
    creator: string;
}