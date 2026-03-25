import { BadGatewayException, BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcryptjs'
import { LoginDto } from "./dto/login.dto";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { AccessTokenType, JWTPayloadType } from "../utils/types";

import { ConfigService } from "@nestjs/config";
import { UpdateUserDto } from "./dto/update_user.dto";
import { UserType } from "src/utils/enums";

@Injectable()
export class UsersService{

 

    constructor(
        @InjectRepository(User)
        private readonly usersRepository :Repository<User>,
        private readonly jwtservice :JwtService,
        private readonly  config:ConfigService
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

            const hashedPassword =await this.hashPassword(password);

            let newUser =this.usersRepository.create({
                email,
                username,
                password:hashedPassword,
            });
 
            newUser=await this.usersRepository.save(newUser);
            //@TODO ->genarete JWT Token 
             // done 
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
         * 
         * @param id id of logged in user 
         * @param updateUserDto data for updating the user
         * @returns updated user from the database
         */
public async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, username } = updateUserDto;

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
        throw new NotFoundException('User not found');
    }

    if (username) {
        user.username = username;
    }

    if (password) {
       
        user.password = await this.hashPassword(password);
    }

    return this.usersRepository.save(user);
}



/**
 * Delete user
 * @param userId id of the user
 * @param payload JWTpayload
 * @returns a success message
 */

public async delete(userId:number ,payload :JWTPayloadType){
    const user =await (this.getCurrentUser(userId));

    if(user.id===payload?.id || payload.userType === UserType.ADMIN){
        await this.usersRepository.remove(user);
        return{message:"Hi Abd , User has been deleted"}

    }


    throw new ForbiddenException("acces denied , you are not allwoed ")
}




        /**
         * Get current user (logged in user)
         * @param id  id of the logged in user
         * @returns the user from the database
         */
        public async getCurrentUser(id :number) :Promise<User>{
         
            const user =await this.usersRepository.findOne({where:{id}});
            if(!user) throw new NotFoundException("Hi Abd , user not found");
            return user;

        }


        /**
         * Get All users from the database
         * @returns collection of users
         */
        public getAll():Promise<User[]>{
            return this.usersRepository.find();
        }



    



        /**
         * Genarate Json Web Token 
         * @param payload JWT payload
         * @returns token
         */
        private genarateJWT(payload:JWTPayloadType):Promise<string>{
            return this.jwtservice.signAsync(payload);
        }




        /**
         * Hashing password 
         * @param password plain text password 
         * @returns hashed password
         */
        private async hashPassword (password :string):Promise<string>{
            const salt =await bcrypt.genSalt(10);
            return bcrypt.hash(password,salt);
        }

}