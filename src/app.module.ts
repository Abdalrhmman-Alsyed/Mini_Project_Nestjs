import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entity/products.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';
import { Review } from './reviews/entity/reviews.entity';
import { User } from './users/entity/user.entity';

@Module({
  imports: [
     UsersModule,
    ProductsModule,
    ReviewsModule,
  
  
   
    TypeOrmModule.forRootAsync({
     inject:[ConfigService],
     useFactory:(config:ConfigService)=>
      { console.log(config.get('DB_PASSWORD'));
        return{
      type:'postgres',
     
      database:config.get<string>("DB_DATABASE"),
      username:config.get<string>("DB_USERNAME"),
      password:config.get<string>("DB_PASSWORD"),
      port:config.get<number>("DB_PORT"),
      host:'127.0.0.1',
      synchronize:process.env.NODE_ENV !== 'production',//only in development
      entities:[Product,User,Review]}
    }
  }),
      ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:`.env.${process.env.NODE_ENV}`
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
