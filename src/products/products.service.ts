import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./entity/products.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./dtos/create-products.dto";
import { UpdateProductDto } from "./dtos/update-products.dto";

 
@Injectable()
 export class ProductService{



    constructor(
        @InjectRepository(Product)
        private readonly productsRepository :Repository<Product>){}


      // create product 
public async create(dto:CreateProductDto){
        const newproduct = this.productsRepository.create(dto);
       return await this.productsRepository.save(newproduct);
    }



    //get one by id
public async getOneBy(id: number){ 
    const product = await this.productsRepository.findOne({
      where: { id }
   });

   if (!product) {
      throw new NotFoundException("Sorry Abd But product not found");
   }
   return product;
}


   // update product 
 public async update(id :number ,dto:UpdateProductDto){
        const product= await this.getOneBy(id);

         product.title= dto.title ?? product.title;
         product.descrription= dto.descrription?? product.descrription;
         product.price =dto.price ?? product.price;

            return this.productsRepository.save(product);
     }


     // get all products 
public async getAll(){
        return await this.productsRepository.find();
    
    }



    // deleted the product by id 
public async delete(id:number){
    const product= await this.getOneBy(id);

    await this.productsRepository.remove(product);
    return{message:'Ok Abd , product deleted successfully'}
        
     }



 }