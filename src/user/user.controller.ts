import { Body, Controller, Get, Post, Put, Patch, Delete, UseInterceptors } from "@nestjs/common";
import { ParamId } from "src/decorators/param-id.decorator";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/update-user.dto";
import { UserService } from "./user.service";

// @UseInterceptors(LogInterceptor)
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
        return this.userService.delete(id);
    }
}