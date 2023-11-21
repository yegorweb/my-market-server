import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import ApiError from 'src/exceptions/errors/api-error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    
    const token = this.extractTokenFromHeader(request)
    if (!token) 
      throw ApiError.UnauthorizedError()

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_ACCESS_SECRET })

      request.user = payload
    } catch {
      throw ApiError.UnauthorizedError()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}