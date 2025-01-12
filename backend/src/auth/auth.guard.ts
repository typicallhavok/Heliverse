import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.jwt;

    if (!token) {
      request.user = null;
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.authService.validateToken(payload);
      request.user = user;
      return true;
    } catch {
      request.user = null;
      return true;
    }
  }
}
