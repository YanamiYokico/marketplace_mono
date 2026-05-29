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
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { MailService } from './mail/mail.service';
import { toPublicUser } from './to-public-user.util';
import { generateVerificationCode } from './verification-code.util';

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

    const code = generateVerificationCode();
    const codeHash = await bcrypt.hash(code, BCRYPT_ROUNDS);
    const expires = new Date(Date.now() + VERIFICATION_EXPIRY_MS);
    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      emailVerificationToken: codeHash,
      emailVerificationExpires: expires,
    });

    try {
      await this.mailService.sendVerificationCode(user.email, user.name, code);
    } catch {
      await this.usersService.deleteById(user.id);
      throw new InternalServerErrorException(
        'Could not send verification email. Please try again later.',
      );
    }

    return {
      message:
        'Registration successful. Check your email for a 6-digit verification code.',
      user: toPublicUser(user),
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    if (user.isEmailVerified) {
      return { message: 'Email is already verified. You can sign in.' };
    }

    if (
      !user.emailVerificationToken ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires <= new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    const codeMatches = await bcrypt.compare(
      dto.code,
      user.emailVerificationToken,
    );
    if (!codeMatches) {
      throw new UnauthorizedException('Invalid or expired verification code');
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

    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Please verify your email before signing in. Enter the code from your email or request a new one.',
      );
    }

    return this.buildAuthResponse(user);
  }

  async resendVerification(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || user.isEmailVerified) {
      return {
        message:
          'If an account exists with this email, a verification code has been sent.',
      };
    }

    const code = generateVerificationCode();
    const codeHash = await bcrypt.hash(code, BCRYPT_ROUNDS);
    const expires = new Date(Date.now() + VERIFICATION_EXPIRY_MS);

    await this.usersService.setVerificationToken(user.id, codeHash, expires);

    try {
      await this.mailService.sendVerificationCode(user.email, user.name, code);
    } catch {
      throw new InternalServerErrorException(
        'Could not send verification email. Please try again later.',
      );
    }

    return {
      message:
        'If an account exists with this email, a verification code has been sent.',
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
