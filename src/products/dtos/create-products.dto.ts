import { IsNotEmpty, IsNumber, IsString, Length, Min } from "class-validator";





export class CreateProductDto{

    @IsString({message:"titile shoulde be string"})
    @IsNotEmpty()
    @Length(2,150)
    title:string;

     @IsString()
     @IsNotEmpty()
      @Length(5,150)
    descrription:string;


    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price:number;
}
