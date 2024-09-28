import { IsString, IsInt, IsArray, IsNotEmpty, ArrayNotEmpty, Min, Max } from 'class-validator';

export class CrudDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(1)
    @Max(120)
    age: number;

    @IsString()
    @IsNotEmpty()
    job: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    hobbies: string[];
}