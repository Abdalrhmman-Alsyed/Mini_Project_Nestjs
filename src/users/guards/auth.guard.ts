import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { CURRENT_USER_KEY } from "src/utils/constants";
import { JWTPayloadType } from "src/utils/types";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtservice: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader)
         throw new UnauthorizedException("Hi Abd , access denied , no authHeader ");
    

    const [type, token] = authHeader.split(" ");

    if (token && type === "Bearer") {
      try {
        const payload: JWTPayloadType = await this.jwtservice.verifyAsync(
          token,
          {
            secret: this.configService.get<string>("JWT_SECRET"),
          }
        );

        request[CURRENT_USER_KEY] = payload;
        return true;
      }
       catch (error) {
        throw new UnauthorizedException("Hi Abd , access denied , invalid token ");
      }
    } 
    else {
        throw new UnauthorizedException("Hi Abd , access denied , no token provided ");
    }
  }
}