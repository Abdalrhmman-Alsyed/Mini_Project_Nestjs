import { User } from "../../users/entity/user.entity";
import { Product } from "../../products/entity/products.entity";
import { CURRENT_TIMESTAMP } from "../../utils/constants";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'reviews'})
export class Review{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'int'})
    rating:number;

    @Column()
    comment:string;

    @CreateDateColumn({type:'timestamp',default:()=>CURRENT_TIMESTAMP})
     createdAt:Date;
    
    @UpdateDateColumn({type:'timestamp',default:()=>CURRENT_TIMESTAMP,onUpdate:CURRENT_TIMESTAMP})
    updatedAt:Date;

    @ManyToOne(()=>Product ,(product)=>product.reviews)
    product:Product;

    @ManyToOne(()=>User,(user)=>user.reviews)
        user:User
}