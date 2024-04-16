import { AuthResetDTO } from "../auth/dto/auth-reset.dto";
import { resetToken } from "./reset-token.mock copy";

export const authResetDTO: AuthResetDTO = {
    password: '654321',
    token: resetToken
}