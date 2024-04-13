import { Role } from "../enums/role.enum";
import { UserEntity } from "../user/entity/user.entity";

export const userEntityList: UserEntity[] = [
{
    name: 'Marcelo',
    email: 'marcelosiqqueira@gmail.com',
    birthAt: new Date('2000-01-01'),
    id: 3,
    password: '$2b$10$LOyQmB5e7UEv649gFByiOeDLasQ3ePQQGCUDhkSXaX0pfTmLGVTE.',
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    name: 'Marcelo2',
    email: 'marcelosiqqueira2@gmail.com',
    birthAt: new Date('2000-01-01'),
    id: 2,
    password: '$2b$10$zVQg8RDm..MtamBTgreMK.BfSUS1VaVZgSqpPzfki5PbeaGNgxeQO',
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    name: 'Marcelo3',
    email: 'marcelosiqqueira3@gmail.com',
    birthAt: new Date('2000-01-01'),
    id: 3,
    password: '$2b$10$zVQg8RDm..MtamBTgreMK.BfSUS1VaVZgSqpPzfki5PbeaGNgxeQO',
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date()
}
];