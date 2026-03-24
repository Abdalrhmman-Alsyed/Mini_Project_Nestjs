import { Module } from "@nestjs/common";
import { ProductController } from "./products.controller";
import { ProductService } from "./products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entity/products.entity";

@Module({

    controllers:[ProductController],
    providers:[ProductService],
    imports:[TypeOrmModule.forFeature([Product])]
})
export class  ProductsModule{}