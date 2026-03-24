import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { User } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcryptjs'
import { LoginDto } from "./dto/login.dto";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { AccessTokenType, JWTPayloadType } from "../utils/types";
import { promises } from "dns";

@Injectable()
export class UsersService{

 

    constructor(
        @InjectRepository(User)
        private readonly usersRepository :Repository<User>,
        private readonly jwtservice :JwtService
    ){}



        /**
         * Create new User
         * @param registerDto data for creating new user
         * @returns JWT (access token)
         */
        public async register(registerDto:RegisterDto):Promise<AccessTokenType>{
            const{email,password,username}=registerDto;

            const userFromDb=await this.usersRepository.findOne({where:{email}});
            if(userFromDb)throw new BadRequestException("Hi Abd user alrady exist");

            const salt =await bcrypt.genSalt(10);
            const hashedPassword =await bcrypt.hash(password,salt);

            let newUser =this.usersRepository.create({
                email,
                username,
                password:hashedPassword,
            });
 
            newUser=await this.usersRepository.save(newUser);
            //@TODO ->genarete JWT Token 

             const accessToken =await this.genarateJWT({id:newUser.id,userType:newUser.userType});
            
            return { accessToken };
            }


            /**
             * Log In User
             * @param loginDto data for log to user account 
             * @returns JWT (access token)
             */
        public async login(loginDto:LoginDto):Promise<AccessTokenType>{
            const {email,password}=loginDto;

            const user =await this.usersRepository.findOne({where:{email}});
            if(!user) throw new BadRequestException("Hi Abd,invalid email");

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(!isPasswordMatch)throw new BadRequestException("Hi Abd,invalid password")

                            const accessToken =await this.genarateJWT({id:user.id, userType:user.userType});
            
                return {accessToken};
        }    


        /**
         * Genarate Json Web Token 
         * @param payload JWT payload
         * @returns token
         */
        private genarateJWT(payload:JWTPayloadType):Promise<string>{
            return this.jwtservice.signAsync(payload);
        }

}