import { IsHash, IsNotEmpty, IsString } from "class-validator";

export class CreateFileDto {

    name?: string;
    originalName?: string;

    @IsNotEmpty()
    @IsString()
    owner: string;

    type?: string;
}