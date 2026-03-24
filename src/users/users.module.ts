import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { User } from "./entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: config.get<string>("JWT_EXPIRES_IN") as any,
        },
      }),
    }),
  ],
})
export class UsersModule {}