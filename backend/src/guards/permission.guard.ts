import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { unauthorizeResponse } from 'src/utils/common.functions';
import messagesConst from 'src/utils/message-const.message';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly allowedPermissions: string[]) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const isPermited = request.user.is_superadmin || request.user.permissions.find(d=>{
      return this.allowedPermissions.includes(d.permission_key)
    });
    if(!isPermited){
      response.json(unauthorizeResponse({}, messagesConst['en'].unauthorize))
      return false;
    }
    
    return true;
  }
}
