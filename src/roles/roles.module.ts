import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './models/role.entity';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { UsersModule } from '../users/users.module';
import { User } from '../users/models/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, User]),
        UsersModule
    ],
    controllers: [RoleController],
    providers: [RoleService, JwtService],
})
export class RolesModule { }
