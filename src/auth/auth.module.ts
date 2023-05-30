import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.mudule";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        JwtModule.register({
            secret: "5em9!7jKZvV5eSWK5Iv$GqMQ#6dVWH$)"
        }),
        forwardRef(() => UserModule),
        PrismaModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})

export class AuthModule{

}