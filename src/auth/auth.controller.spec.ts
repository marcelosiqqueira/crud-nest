import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller";
import { AuthGuard } from "../guards/auth.guard";
import { guardMock } from "../testing/guard.mock";
import { authServiceMock } from "../testing/auth-service.mock";
import { fileServiceMock } from "../testing/file-service.mock";
import { authLoginDTO } from "../testing/auth-login-dto.mock";
import { acessToken } from "../testing/acess-token.mock";
import { authRegisterDTO } from "../testing/auth-register-dto.mock";
import { authResetDTO } from "../testing/auth-reset-dto.mock";
import { userEntityList } from "../testing/user-entity-list.mock";
import { getPhoto } from "../testing/get-photo.mock";

describe('AuthController', () => {

    let authController: AuthController;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [authServiceMock, fileServiceMock]
        })

        .overrideGuard(AuthGuard)
        .useValue(guardMock)
        .compile();

        authController = module.get<AuthController>(AuthController);
    });

    test('Validar a definição', () => {
        expect(authController).toBeDefined();
    });

    describe('Fluxo de autenticação', () => {

        test('login method',async () => {
            const result = await authController.login(authLoginDTO);
            expect(result).toEqual({acessToken});
        });

        test('register method',async () => {
            const result = await authController.register(authRegisterDTO);
            expect(result).toEqual({acessToken});
        });

        test('forget method',async () => {
            const result = await authController.forget(authRegisterDTO);
            expect(result).toEqual({sucess: true});
        });

        test('reset method',async () => {
            const result = await authController.reset(authResetDTO);
            expect(result).toEqual({acessToken});
        });
    });


    describe('Rotas Autenticadas', () => {
        test('me method',async () => {
            const result = await authController.me(userEntityList[0]);
            expect(result).toEqual(userEntityList[0]);
        });

        test('uploadPhoto method', async () => {
            const photo = await getPhoto();
            const result = await authController.uploadPhoto(userEntityList[0], photo);
            expect(result).toEqual({sucess: true});
        });
    });


});