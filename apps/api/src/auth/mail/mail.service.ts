import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private readonly transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.getOrThrow<string>('MAIL_HOST'),
            port: this.configService.getOrThrow<number>('MAIL_PORT'),
            auth: {
                user: this.configService.getOrThrow<string>('MAIL_USER'),
                pass: this.configService.getOrThrow<string>('MAIL_PASS'),
            },
        });
    }

    async sendVerificationEmail(
        to: string,
        name: string,
        token: string,
    ): Promise<void> {
        const appUrl = this.configService.getOrThrow<string>('APP_URL');
        const verifyUrl = `${appUrl}/auth/verify-email?token=${token}`;
        const from = this.configService.getOrThrow<string>('MAIL_FROM');

        try {
            await this.transporter.sendMail({
                from,
                to,
                subject: 'Verify your Amazon Clone account',
                html: `
          <p>Hi ${name},</p>
          <p>Thanks for signing up. Please verify your email address by clicking the link below:</p>
          <p><a href="${verifyUrl}">Verify my email</a></p>
          <p>Or copy this link into your browser:</p>
          <p>${verifyUrl}</p>
          <p>This link expires in 24 hours.</p>
          <p>If you did not create an account, you can ignore this email.</p>
        `,
            });
        } catch (error: unknown) {
            this.logger.error('Failed to send verification email', error);
            throw new InternalServerErrorException(
                'Could not send verification email. Please try again later.',
            );
        }
    }
}