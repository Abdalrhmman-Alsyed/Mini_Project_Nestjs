import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";


@Controller("api/users")
export class UsersController{

    constructor(
        private readonly usersService:UsersService
    ){}


@Post("auth/register")
    public register(@Body() body:RegisterDto){
        return this.usersService.register(body);

      
    }

    
    
    @Post("auth/login")
    @HttpCode(HttpStatus.OK)
    public loign(@Body() body:LoginDto){
        return this.usersService.login(body);

      
    }
}