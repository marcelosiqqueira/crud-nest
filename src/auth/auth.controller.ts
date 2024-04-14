import { Body, Controller, Post, Headers, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException,
 UploadedFiles, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { User } from "src/decorators/user.decorator";
import { AuthGuard } from "src/guards/auth.guard";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import {writeFile} from 'fs/promises'
import {join} from 'path';
import { FileService } from "src/file/file.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly fileService: FileService
    ) {}

    @Post('login')
    async login(@Body() { email, password }: AuthLoginDTO) {
        return this.authService.login(email, password);
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO) {
        return this.authService.register(body); 
    }

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDTO) {
        return this.authService.forget(email)
    }

    @Post('reset')
    async reset(@Body() {password, token}: AuthResetDTO) {
        return this.authService.reset(password, token)
    }
  
    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User() user) {
        return {user}; 
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(
        @User() user, @UploadedFile(new ParseFilePipe({
            validators: [
                new FileTypeValidator({fileType:'image/png'}),
                new MaxFileSizeValidator({maxSize: 1024 * 50}),
            ]
        })) photo: Express.Multer.File
    ) {
        const filename = `photo - ${user.id}.png`;

        try{
            await this.fileService.upload(photo, filename); 
        }catch (e) {
            throw new BadRequestException(e);
        }
        
        return {sucess: true};
    }

    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
        return files;
    }

    @UseInterceptors(FileFieldsInterceptor([{
        name: 'photo',
        maxCount: 1
    }, {
        name: 'documents',
        maxCount: 10
    }]))
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async uploadFilesFields(@User() user, @UploadedFiles() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}) {
        return files;
    }
}