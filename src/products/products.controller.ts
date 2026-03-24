import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { title } from "process";
import { CreateProductDto } from "./dtos/create-products.dto";
import { UpdateProductDto } from "./dtos/update-products.dto";
import { ProductService } from "./products.service";
 
@Controller("api/products")
export class ProductController{

constructor(private readonly productService:ProductService){}


@Get()
    public getAllProducts(){
       return this.productService.getAll();
    }


    @Post()
    public createNewProducts(@Body() body: CreateProductDto){
        return this.productService.create(body);
    }

    @Get(":id")
    public getOneProduct(@Param("id",ParseIntPipe) id:number){
            return this.productService.getOneBy(id);
    }

    @Put(":id")
    public updateProduct(
        @Param("id",ParseIntPipe) id:number,
         @Body() body:UpdateProductDto){


        return this.productService.update(id ,body);

    }


    @Delete(":id")
    public deleteProduct(
        @Param("id",ParseIntPipe) id:number){
                return this.productService.delete(id);
    }
} 