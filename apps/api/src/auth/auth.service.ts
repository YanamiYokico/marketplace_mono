import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from './mail/mail.service';
import { toPublicUser } from './to-public-user.util';

const VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000;
const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + VERIFICATION_EXPIRY_MS);
    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      emailVerificationToken: token,
      emailVerificationExpires: expires,
      isEmailVerified: true,
    });

    return {
      message: 'Registration successful.',
      user: toPublicUser(user),
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification link');
    }

    if (user.isEmailVerified) {
      return { message: 'Email is already verified. You can sign in.' };
    }

    await this.usersService.markEmailVerified(user.id);

    return { message: 'Email verified successfully. You can now sign in.' };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  async resendVerification(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || user.isEmailVerified) {
      return {
        message:
          'If an account exists with this email, a verification link has been sent.',
      };
    }

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + VERIFICATION_EXPIRY_MS);

    await this.usersService.setVerificationToken(user.id, token, expires);

    try {
      await this.mailService.sendVerificationEmail(user.email, user.name, token);
    } catch {
      throw new InternalServerErrorException(
        'Could not send verification email. Please try again later.',
      );
    }

    return {
      message:
        'If an account exists with this email, a verification link has been sent.',
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { user: toPublicUser(user) };
  }

  private buildAuthResponse(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: toPublicUser(user),
    };
  }
}
