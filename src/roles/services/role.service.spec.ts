import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { Role } from '../models/role.entity';
import { RoleAssignDto } from '../controllers/dto/role-assign.dto';
import { User } from '../../users/models/user.entity';

describe('RoleService', () => {
    let roleService: RoleService;

    const mockRoleRepository = {
        find: jest
            .fn()
            .mockImplementationOnce(() => Promise.resolve([]))
            .mockImplementationOnce(() => Promise.resolve([{ id: 1 }]))
            .mockImplementationOnce(() =>
                Promise.resolve([{ id: 1 }, { id: 2 }]),
            ),
        update: jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve({
                    raw: [],
                    affected: 1,
                    generatedMaps: [],
                }),
            ),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoleService,
                { provide: getRepositoryToken(Role), useValue: mockRoleRepository },
                { provide: getRepositoryToken(User), useValue: mockRoleRepository },
            ],
        }).compile();

        roleService = module.get<RoleService>(RoleService);
    });

    it('should be defined', () => {
        expect(roleService).toBeDefined();
    });

    it('should get all roles', async () => {
        let result = await roleService.getAll();
        expect(result.length).toBe(0);
        expect(result).toEqual([]);

        result = await roleService.getAll();
        expect(result.length).toBe(1);
        expect(result).toEqual([{ id: 1 }]);

        result = await roleService.getAll();
        expect(result.length).toBe(2);
        expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should assign role to user', async () => {
        const dataRequest = {
            roleId: { id: 1 },
            userId: { id: 1 }
        } as RoleAssignDto;

        expect(await roleService.roleAssign(dataRequest)).toEqual({
            raw: [],
            affected: 1,
            generatedMaps: [],
        });
    });
});
