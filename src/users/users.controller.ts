import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { JWTPayloadType } from "../utils/types";
import { Roles } from "./decorators/user_role.decorator";
import { UserType } from "src/utils/enums";
import { AuthRolesGuard } from "./guards/auth_roles.guard";

@Controller("api/users")
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post("auth/register")
  public register(@Body() body: RegisterDto) {
    return this.usersService.register(body);
  }

  @Post("auth/login")
  @HttpCode(HttpStatus.OK)
  public login(@Body() body: LoginDto) {
    return this.usersService.login(body);
  }

  @Get("current-user")
  @UseGuards(AuthGuard)
  public getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
    return this.usersService.getCurrentUser(payload.id);
  }



@Get()
@Roles(UserType.ADMIN)
@UseGuards(AuthRolesGuard)
  public getAllUsers(){
    return this.usersService.getAll();
  }
}