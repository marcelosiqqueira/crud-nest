import { Body, Controller, Get, Param, Post, Put, Patch, Delete } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller('users')
export class UserController {

    @Post()
    async create(@Body() { email, name, password }: CreateUserDto ){
        return { email, name, password };
    }

    @Get()
    async list(){
        return {users:[]}
    }

    @Get(':id')
    async show(@Param() params){
        return {user:{}, params}
    }

    @Put(':id')
    async update(@Body() body, @Param() params){
        return{
            method: 'put',
            body,
            params
        }
    }

    @Patch(':id')
    async updatePartial(@Body() body, @Param() params){
        return{
            method: 'patch',
            body,
            params
        }
    }

    @Delete(':id')
    async delete(@Param() params){
        return {
            params
        }
    }
}