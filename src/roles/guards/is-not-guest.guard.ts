import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { getRoleId } from '../utils/validate-token';

@Injectable()
export class IsNotGuestGuard implements CanActivate {

    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // DRY function for validate roleId for all guards
        const roleId = getRoleId(context, this.jwtService);

        return roleId == 1 || roleId == 2 || roleId == 3;
    }
}
