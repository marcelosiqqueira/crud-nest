import { IsJWT, IsStrongPassword } from "class-validator";

export class AuthMeDTO {
    @IsJWT()
    token: string;
}