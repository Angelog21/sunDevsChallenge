import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../src/roles/models/role.entity';
import { RolesModule } from '../../src/roles/roles.module';
import { UpdateResult } from 'typeorm';
import { UsersModule } from '../../src/users/users.module';
import { User } from '../../src/users/models/user.entity';
import { AuthModule } from '../../src/auth/auth.module';

jest.mock('bcryptjs', () => {
  return {
    compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
  };
});

describe('RoleController (e2e)', () => {
  let app: INestApplication;

  const role = {
    id: "1",
    name: "Admin"
  };

  const updateResponse: UpdateResult = {
    raw: [],
    affected: 1,
    generatedMaps: [],
  }

  const mockRoleRepository = {
    find: jest.fn().mockImplementation(() => Promise.resolve([role])),
    roleAssign: jest.fn().mockImplementation(() => Promise.resolve())
  };

  const mockUserRepository = {
    findOne: jest
      .fn()
      .mockImplementation((user) => Promise.resolve({ ...user, id: 1, roleId: { id: 1 } })),
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UsersModule,
        RolesModule
      ],
    })
      .overrideProvider(getRepositoryToken(Role))
      .useValue(mockRoleRepository)
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
      }),
    );
    await app.init();
  });

  async function getValidToken() {
    const {
      body: { access_token },
    } = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'admin@test.com',
      password: '123456',
    });
    return access_token;
  }

  it('/api/roles (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/roles')
      .auth(await getValidToken(), { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect([role]);
  });

  it('/api/roles/assign (POST)', async () => {

    const dataSend = {
      userId: 1,
      roleId: 1
    }

    return request(app.getHttpServer())
      .post('/api/roles/assign')
      .auth(await getValidToken(), { type: 'bearer' })
      .send(dataSend)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .expect(updateResponse);
  });

  it('/api/roles/assign (POST) should fail because missing parameters', async () => {
    return request(app.getHttpServer())
      .post('/api/roles/assign')
      .auth(await getValidToken(), { type: 'bearer' })
      .send({})
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });


  it('/api/roles/assign (POST) should fail because invalid parameter and not found', async () => {

    const dataSend = {
      userId: "aaa",
      roleId: "aaa"
    }

    return request(app.getHttpServer())
      .patch('/api/roles/assign')
      .auth(await getValidToken(), { type: 'bearer' })
      .send(dataSend)
      .expect(404)
      .expect('Content-Type', /application\/json/);
  });
});
