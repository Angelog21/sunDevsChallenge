import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Role } from '../../models/role.entity';
import { User } from '../../../users/models/user.entity';

export class RoleAssignDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  roleId: Role;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  userId: User;
}
