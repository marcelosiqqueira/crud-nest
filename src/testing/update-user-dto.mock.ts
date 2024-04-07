import { Role } from "../enums/role.enum";
import { UpdatePutUserDTO } from "../user/dto/update-user.dto";

export const updatePutUserDTO: UpdatePutUserDTO = {
    birthAt: '2000-01-01',
    email: 'marcelosiqqueira@gmail.com',
    name: 'Marcelo',
    password: '123456',
    role: Role.User
};