import { Injectable, NotFoundException } from "@nestjs/common";
import { getMaxListeners } from "process";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/update-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    async create({email, name, password}: CreateUserDTO) {

        const salt = await bcrypt.genSalt();

        password = await bcrypt.hash(password, salt);

        return await this.prisma.user.create({
            data: {
                email,
                name,
                password
            },
        });
    }

    async list() {
        return this.prisma.user.findMany();
    }

    async show(id: number) {

        await this.exists(id);

        return this.prisma.user.findUnique({
            where: {
                id,
            }
        })
    }

    async update(id: number, { email, name, password, birthAt, role }: UpdatePutUserDTO ) {
        console.log({email, name, password});

        if(!birthAt) {
            birthAt = null;
        }

        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);

        return this.prisma.user.update({
            data: { email, name, password, birthAt: birthAt ? new Date(birthAt) : null, role },
            where: {
                id
            }
        });
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

        return this.prisma.user.update({
            data,
            where: {
                id
            }
        });
    }

    async delete(id: number) {

        if (!await this.show(id)) {
            throw new NotFoundException(`O usuário ${id} não existe.`);
        }

        return this.prisma.user.delete({
            where: {
                id 
            }
        })
    }

    async exists(id: number) {
        if(!(await this.prisma.user.count({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`O usuário ${id} não existe.`);
        }
    }
    
}