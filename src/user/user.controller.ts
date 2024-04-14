import { Body, Controller, Get, Post, Put, Patch, Delete, UseInterceptors, UseGuards } from "@nestjs/common";
import { Roles } from "../decorators/role.decorator";
import { Role } from "../enums/role.enum";
import { AuthGuard } from "../guards/auth.guard";
import { RoleGuard } from "../guards/role.guard";
import { LogInterceptor } from "../interceptors/log.interceptor";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { ParamId } from "../decorators/param-id.decorator";
import { UpdatePutUserDTO } from "./dto/update-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";


@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Post()
    async create(@Body() date: CreateUserDTO ){
        return this.userService.create( date );
    }
                                  
    @Get()
    async list(){
        return this.userService.list();
    }

    @Get(':id')
    async show(@ParamId() id: number){
        return this.userService.show(id);
    }

    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number){
        return this.userService.update(id, data)
    }

    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number){
        return this.userService.updatePartial(id, data)
    }

    @Delete(':id')
    async delete(@ParamId() id: number){
        return this.userService.delete(id)

    }
}