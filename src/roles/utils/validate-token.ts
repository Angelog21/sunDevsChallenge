import { ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export const getRoleId = (context: ExecutionContext, jwtService: JwtService) => {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization ? request.headers.authorization.split(' ')[1] : false;

    if (!token) return false;

    const data = jwtService.decode(token);

    return data.roleId;
}