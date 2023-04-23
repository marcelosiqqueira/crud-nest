import { Injectable, NotFoundException } from "@nestjs/common";
import { getMaxListeners } from "process";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/update-user.dto";

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {

    }

    async create({email, name, password}: CreateUserDTO) {

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
        return this.prisma.user.findUnique({
            where: {
                id,
            }
        })
    }

    async update(id: number, {email, name, password, birthAt}: UpdatePutUserDTO ) {
        console.log({email, name, password});

        if(!birthAt) {
            birthAt = null;
        }

        return this.prisma.user.update({
            data: {email, name, password, birthAt: birthAt ? new Date(birthAt) : null},
            where: {
                id
            }
        });
    }

    async updatePartial(id: number, {email, name, password, birthAt}: UpdatePatchUserDTO ) {
        
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
            data.password = password;
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
    
}