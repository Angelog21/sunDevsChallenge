import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from '../services/role.service';
import { RoleAssignDto } from './dto/role-assign.dto';

describe('RoleController', () => {
  let roleController: RoleController;

  const mockRolesService = {
    getAll: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve([{
        id: "1",
        name: "Admin"
      }]))
      .mockImplementationOnce(() =>
        Promise.resolve([{
          id: "1",
          name: "Admin"
        },
        {
          id: "2",
          name: "Agent"
        }]),
      ),
    roleAssign: jest
      .fn()
      .mockImplementation((dto) =>
        Promise.resolve({
          raw: [],
          affected: 1,
          generatedMaps: [],
        }),
      )
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [RoleService, JwtService],
    })
      .overrideProvider(RoleService)
      .useValue(mockRolesService)
      .compile();

    roleController = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(roleController).toBeDefined();
  });

  it('should find all roles', async () => {
    let result = await roleController.getAll();

    expect(result.length).toBe(0);
    expect(result).toEqual([]);

    result = await roleController.getAll();
    expect(result.length).toBe(1);
    expect(result).toEqual([{
      id: "1",
      name: "Admin"
    }]);

    result = await roleController.getAll();
    expect(result.length).toBe(2);
    expect(result).toEqual([{
      id: "1",
      name: "Admin"
    },
    {
      id: "2",
      name: "Agent"
    }]);
  });

  it('should assign role to user', async () => {

    const dataRequest = {
      roleId: { id: 1 },
      userId: { id: 1 }
    } as RoleAssignDto;

    expect(await roleController.roleAssign(dataRequest)).toEqual({
      raw: [],
      affected: 1,
      generatedMaps: [],
    });
  });
});
