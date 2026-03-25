import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express"; 
import { CURRENT_USER_KEY } from "../../utils/constants";
import { JWTPayloadType } from "../../utils/types";
import {Reflector} from "@nestjs/core"
import { UserType } from "src/utils/enums";
import { UsersService } from "../users.service";
import { TreeRepositoryUtils } from "typeorm";

@Injectable()
export class AuthRolesGuard implements CanActivate {

  constructor(
    private readonly jwtservice: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserType[] = this.reflector.getAllAndOverride<UserType[]>('roles', [
      context.getHandler(),
      context.getClass()
    ]);

    if (!roles || roles.length === 0) return true; 

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException("No authorization header");

    const [type, token] = authHeader.split(" ");
    if (!token || type !== "Bearer")
      throw new UnauthorizedException("Invalid token format");

    try {
      const payload: JWTPayloadType = await this.jwtservice.verifyAsync(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });

      const user = await this.usersService.getCurrentUser(payload.id);
      if (!user) return false;

      if (roles.includes(user.userType)) {
        request[CURRENT_USER_KEY] = payload;
        return true;
      } else {
        return false; // Forbidden
      }
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}