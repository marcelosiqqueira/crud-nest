import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { CreateUserDTO } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm";
import { UpdatePutUserDTO } from "./dto/update-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) {}

    async create( data: CreateUserDTO) {

        if(await this.usersRepository.exists({
            where: {
                email: data.email
            }
        })) {
            throw new BadRequestException('Este e-mail já está sendo usado.');

        }

        const salt = await bcrypt.genSalt();

        data.password = await bcrypt.hash(data.password, salt);

        const user = this.usersRepository.create(data);

        return this.usersRepository.save(user);
    }

    async list() {
        return this.usersRepository.find();
    }

    async show(id: number) {

        await this.exists(id);

        return this.usersRepository.findOneBy({
            id
        })
    }

    async update(id: number, { email, name, password, birthAt, role }: UpdatePutUserDTO ) {
        console.log({email, name, password});

        if(!birthAt) {
            birthAt = null;
        }

        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);

        await this.usersRepository.update(id, {
            email,
            name,
            password,
            birthAt: birthAt ? new Date(birthAt) : null,
            role 
        });

        return this.show(id);
    }

    async updatePartial(id: number, {email, name, password, birthAt, role}: UpdatePatchUserDTO ) {
        
        const data: any = {};

        if (birthAt) {
            data.birthAt = new Date(birthAt);
        }

        if(email) {
            data.email = email;
        }

        if(name) {
            data.name = name;
        }

        if(password) {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(password, salt);
        }

        if(role) {
            data.role = role;
        }

        await this.usersRepository.update(id, data);

        return this.show(id);
    }

    async delete(id: number) {

        if (!await this.show(id)) {
            throw new NotFoundException(`O usuário ${id} não existe.`);
        }

        await this.usersRepository.delete(id);

        return true;
    }

    async exists(id: number) {
        if(! await(this.usersRepository.exists({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`O usuário ${id} não existe.`);
        }
    }
    
}