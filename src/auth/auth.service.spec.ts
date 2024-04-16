 import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { userRepositoryMock } from "../testing/user-repository-mock";
import { jwtServiceMock } from "../testing/jwt-service-mock";
import { userServiceMock } from "../testing/user-service-mock";
import { mailerServiceMock } from "../testing/mailer-service-mock";
import { userEntityList } from "../testing/user-entity-list.mock";
import { acessToken } from "../testing/acess-token.mock";
import { jwtPayload } from "../testing/jwt-payload.mock";
import { resetToken } from "../testing/reset-token.mock copy";
import { authRegisterDTO } from "../testing/auth-register-dto.mock";

describe('AuthService', () => {

    let authService: AuthService;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                userRepositoryMock,
                jwtServiceMock,
                userServiceMock,
                mailerServiceMock
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    test('Validar a definição', () => {
        expect(authService).toBeDefined();
    });

    describe('Token', () => {

        test('createToken method', () => {

            const result = authService.createToken(userEntityList[0]);

            expect(result).toEqual({
                acessToken
            });
        });

        test('checkToken method', () => {

            const result = authService.checkToken(acessToken);

            expect(result).toEqual(jwtPayload);
        });

        test('isValidToken method', () => {

            const result = authService.isValidToken(acessToken);

            expect(result).toEqual(true);
        });
    });

    describe('Autenticação', () => {

        test('login method', async () => {

            const result = await authService.login('marcelosiqqueira@gmail.com', '123456');

            expect(result).toEqual({acessToken});
        });

        test('forget method', async () => {

            const result = await authService.forget('marcelosiqqueira@gmail.com');

            expect(result).toEqual({sucess: true});
        });

        test('reset method', async () => {

            const result = await authService.reset('123456', resetToken);

            expect(result).toEqual({acessToken});
        });

        test('register method', async () => {

            const result = await authService.register(authRegisterDTO);

            expect(result).toEqual({acessToken});
        });
    });

});