import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IRole } from "../interfaces/role.interface";
import { Role } from "../models/role.entity";
import { Repository, UpdateResult } from "typeorm";
import { roles } from "../data/data";
import { RoleAssignDto } from '../controllers/dto/role-assign.dto';
import { User } from "../../users/models/user.entity";

/**
 * Service dealing with role based operations.
 *
 * @class
 */
@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role) private readonly repository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  /**
   * Seed all roles.
   *
   * @function
   */
  createAll(): Array<Promise<Role>> {
    return roles.map(async (role: IRole) => {
      return await this.repository
        .findOne({
          where: {
            name: role.name,
          }
        })
        .then(async dbRole => {
          // We check if a role already exists.
          // If it does don't create a new one.
          if (dbRole) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.repository.save(role),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * get all roles.
   *
   * @function
   */
  async getAll(): Promise<Role[] | undefined> {
    return this.repository.find();
  }

  /**
   * Assign a role to a user
   *
   * @function
   */
  async roleAssign(roleAssingDto: RoleAssignDto): Promise<UpdateResult> {
    return this.userRepository.update(roleAssingDto.userId, { roleId: roleAssingDto.roleId });
  }
}