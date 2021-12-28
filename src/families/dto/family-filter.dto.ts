import { IsNotEmpty, IsString } from "class-validator";

export class FamilyFilterDto {

    name: string;

    charity: string;

    head: string;

    creator: string;

    memberCount: number;

}