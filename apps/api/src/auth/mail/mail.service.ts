import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.getOrThrow<string>('RESEND_API_KEY'));
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void> {
    const appUrl = this.configService.getOrThrow<string>('APP_URL');
    const verifyUrl = `${appUrl}/auth/verify-email?token=${token}`;
    const from = this.configService.getOrThrow<string>('MAIL_FROM');

    const { error } = await this.resend.emails.send({
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

    if (error) {
      this.logger.error(`Failed to send verification email: ${error.message}`);
      throw error;
    }
  }
}
