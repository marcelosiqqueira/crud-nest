import * as bcrypt from 'bcrypt';
import { UserService } from "../user/user.service";
import { MailerService } from "@nestjs-modules/mailer";
import { Repository } from "typeorm";
import { UserEntity } from "../user/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService{

    private issuer = 'login';
    private audience = 'users'; 
    
    constructor(
        private readonly JWTService: JwtService, 
        private readonly userService: UserService,
        private readonly mailer: MailerService,
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) {} 
    

    createToken(user: UserEntity) {
        return {
            acessToken: this.JWTService.sign({
                id: user.id,
                name: user.name,
                email: user.email,
            }, {
                expiresIn: "7 days",
                subject: String(user.id),
                issuer: this.issuer,
                audience: this.audience
            })
        }
    }

    checkToken(token: string) {
        try{
            const data = this.JWTService.verify(token, {
                issuer: this.issuer,
                audience: this.audience
            });

            return data; 
        }catch (e) {
            throw new BadRequestException(e);
        }       
    }

    isValidToken(token: string) {
        try{
            this.checkToken(token); 
            return true; 
        } catch (e) {
            return false;
        }
    }

    async login( email:string, password:string) {

        const user = await this.usersRepository.findOne({
            where: {
                email,
            }
        });

        if(!user) {
            throw new UnauthorizedException('Email e/ou senha incorretos.')
        }

        if (!await bcrypt.compare(password, user.password)){
            throw new UnauthorizedException('Email e/ou senha incorretos.')
        }

        return this.createToken(user);
    }

    async forget(email: string) {

        const user = await this.usersRepository.findOneBy ({
            email
        });

        if(!user) {
            throw new UnauthorizedException('Email está incorreto.')
        }
        
        const token = this.JWTService.sign({
            id: user.id
        }, {
            expiresIn: "30 minutes",
            subject: String(user.id),
            issuer: 'forget',
            audience: 'users',
        });

        await this.mailer.sendMail({
            subject: 'Recuperação de Senha',
            to: 'marcelosiqqueira@gmail.com',
            template: 'forget',
            context: {
                name: user.name,
                token
            }
        });

        return {sucesss: true};
    }

    async reset(password: string, token: string) {
        try{
            const data:any = this.JWTService.verify(token, {
                issuer: 'forget',
                audience: 'users',
            });


            if (isNaN(Number(data.id))) {
                throw new BadRequestException("Token é inválido.");
            }

            const id = Number(data.id);

            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);

            await this.usersRepository.update(id, {
                password
            });

            const user = await this.userService.show(id);
        
        return this.createToken(user);

        }catch (e) {
            throw new BadRequestException(e);
        }  
    }

    async register(data: AuthRegisterDTO) {
        delete data.role;

        const user = await this.userService.create(data);
        return this.createToken(user);
    }

}