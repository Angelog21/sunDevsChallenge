import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../../auth/guards/jwt-auth.guard';
import { RoleService } from '../services/role.service';
import { RoleAssignDto } from './dto/role-assign.dto';
import { UpdateResult } from 'typeorm';
import { IApiResponse } from '../../interfaces/api-response.interface';
import { IsAdminGuard } from '../guards/is-admin.guard';

@ApiTags('Roles and Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, IsAdminGuard)
@Controller('/api/roles')
export class RoleController {

    constructor(
        private roleService: RoleService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all roles and permissions' })
    @ApiResponse({
        status: 200,
        description: 'Get an array with all roles',
        schema: {
            example: [
                {
                    id: 1,
                    name: 'Admin',
                    createdAt: '2024-08-06 14:00:18.714311',
                    updatedAt: '2024-08-06 14:00:18.714311',
                    deletedAt: null,
                }
            ],
        },
    })
    async getAll() {
        return this.roleService.getAll();
    }

    @Get("/createAll")
    @ApiOperation({ summary: 'Create all roles' })
    @ApiResponse({
        status: 200,
        description: 'Create all roles for db app',
        schema: {
            example: [
                {
                    id: 1,
                    name: 'Admin',
                    createdAt: '2024-08-06 14:00:18.714311',
                    updatedAt: '2024-08-06 14:00:18.714311',
                    deletedAt: null,
                }
            ],
        },
    })
    async createAll() {
        try {
            return this.roleService.createAll();
        } catch (error) {
            return {
                statusCode: 500,
                isSuccess: false,
                message: 'Error server'
            }
        }
    }

    @Post("/assign")
    @ApiOperation({ summary: 'Assing a role to user', description: '(1 = admin, 2 = agent, 3 = customer, 4 = guest)' })
    @ApiBody({ type: RoleAssignDto })
    @ApiResponse({
        status: 201,
        description: 'Role successfully assigned',
        schema: {
            example: {
                generatedMaps: [],
                raw: [],
                affected: 1,
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'User failed to be assigned role',
        schema: {
            example: {
                statusCode: 400,
                message: ['Missing parameters (userId, roleId)'],
                error: 'Bad Request',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'User or role not found',
        schema: {
            example: {
                statusCode: 404,
                message: ['User or role is not found'],
            },
        },
    })
    async roleAssign(
        @Body() roleAssignDto: RoleAssignDto,
    ): Promise<UpdateResult | IApiResponse> {
        try {
            if (roleAssignDto.roleId.id < 1 || roleAssignDto.roleId.id > 4) {
                return {
                    statusCode: 400,
                    isSuccess: false,
                    message: 'Invalid role assignment'
                }
            }

            return this.roleService.roleAssign(roleAssignDto);
        } catch (error) {
            return {
                statusCode: 500,
                isSuccess: false,
                message: 'Error server'
            }
        }
    }
}
