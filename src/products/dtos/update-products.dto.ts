import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";






export class UpdateProductDto{


      @IsString({message:"titile shoulde be string"})
        @IsNotEmpty()
        @Length(2,150)
        @IsOptional()
    title?:string;


     @IsString()
     @IsNotEmpty()
      @Length(5,150)
        @IsOptional()
    descrription?:string;


       @IsNumber()
        @IsNotEmpty()
        @Min(0)
        @IsOptional()
    price?:number;
}