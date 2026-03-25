import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";


export class UpdateUserDto{

    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(250)
    email?:string;

     @IsOptional()
    @IsString()
     @IsNotEmpty()
     @MinLength(6)
    password?:string;

    @IsOptional()
    @IsString()
    @Length(2,150)
    username?:string;

}