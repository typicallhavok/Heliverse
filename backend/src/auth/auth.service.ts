import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    let user;

    // First try pantry staff
    user = await this.prisma.pantryStaff.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return { ...result, role: 'pantry' };
    }

    // Then try admin
    user = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return { ...result, role: 'admin' };
    }

    // Finally try delivery staff
    user = await this.prisma.deliveryStaff.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return { ...result, role: 'delivery' };
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(userData: any) {
    // Check if email exists in any user table
    const existingUser =
      (await this.prisma.pantryStaff.findUnique({
        where: { email: userData.email },
      })) ||
      (await this.prisma.admin.findUnique({
        where: { email: userData.email },
      })) ||
      (await this.prisma.deliveryStaff.findUnique({
        where: { email: userData.email },
      }));

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    try {
      let newUser;
      switch (userData.role) {
        case 'admin':
          newUser = await this.prisma.admin.create({
            data: {
              email: userData.email,
              password: hashedPassword,
              name: userData.name,
            },
            select: {
              id: true,
              email: true,
              name: true,
            },
          });
          break;

        case 'delivery':
          newUser = await this.prisma.deliveryStaff.create({
            data: {
              email: userData.email,
              password: hashedPassword,
              name: userData.name,
            },
            select: {
              id: true,
              email: true,
              name: true,
            },
          });
          break;

        default: // pantry staff
          newUser = await this.prisma.pantryStaff.create({
            data: {
              email: userData.email,
              password: hashedPassword,
              name: userData.name,
              contact: userData.contact || '',
              location: userData.location || 'Main Kitchen',
              role: userData.staffRole || 'Kitchen Staff',
              assignedTasks: [],
            },
            select: {
              id: true,
              email: true,
              name: true,
              contact: true,
              location: true,
              role: true,
            },
          });
      }

      return {
        access_token: this.jwtService.sign({
          email: newUser.email,
          sub: newUser.id,
          role: userData.role || 'pantry',
        }),
        user: {
          ...newUser,
          role: userData.role || 'pantry',
        },
      };
    } catch (error) {
      throw new ConflictException('Error creating user');
    }
  }

  async validateToken(payload: any) {
    let user;

    switch (payload.role) {
      case 'admin':
        user = await this.prisma.admin.findUnique({
          where: { id: payload.sub },
        });
        break;
      case 'delivery':
        user = await this.prisma.deliveryStaff.findUnique({
          where: { id: payload.sub },
        });
        break;
      default:
        user = await this.prisma.pantryStaff.findUnique({
          where: { id: payload.sub },
        });
    }

    if (!user) throw new UnauthorizedException();

    const { password, ...result } = user;
    return { ...result, role: payload.role };
  }
}
