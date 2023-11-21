import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  getIdFromRole(role: string): string {
    return role.split('-')[2]
  }

  getObjectIdFromRole(role: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(this.getIdFromRole(role))
  }

  isSomeAdmin(roles: string[]): boolean {
    return roles.some(role => role.split('-')[1] === 'admin')
  }

  isGlobalAdmin(roles: string[]) {
    return roles.includes('global-admin')
  }  

  isOwner(roles: string[]): boolean {
    return roles.includes('owner')
  }

  getType(roles: string[]): string {
    if (this.isSomeAdmin(roles))
      return 'админ'
      
    return 'пользователь'
  }
}
