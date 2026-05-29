import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {}

  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.getOrThrow<string>('MAIL_HOST'),
        port: this.configService.getOrThrow<number>('MAIL_PORT'),
        auth: {
          user: this.configService.getOrThrow<string>('MAIL_USER'),
          pass: this.configService.getOrThrow<string>('MAIL_PASS'),
        },
      });
    }
    return this.transporter;
  }

  async sendVerificationCode(
    to: string,
    name: string,
    code: string,
  ): Promise<void> {
    const from = this.configService.getOrThrow<string>('MAIL_FROM');

    try {
      await this.getTransporter().sendMail({
        from,
        to,
        subject: 'Your verification code',
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for signing up. Enter this code to verify your email:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
          <p>This code expires in 24 hours.</p>
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
