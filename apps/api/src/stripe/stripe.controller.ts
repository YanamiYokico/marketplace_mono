import { Controller, Post, Param, Req, UseGuards, Headers, RawBodyRequest, BadRequestException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

type AuthRequest = { user: { userId: string } };

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-checkout-session/:orderId')
  createCheckoutSession(
    @Req() req: AuthRequest,
    @Param('orderId') orderId: string,
  ) {
    return this.stripeService.createCheckoutSession(req.user.userId, orderId);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    console.log('--- WEBHOOK RECEIVED ---');
    console.log('Signature:', signature ? 'Present' : 'Missing');
    
    if (!signature) {
      throw new BadRequestException('No signature provided');
    }
    
    const rawBody = req.rawBody;
    console.log('RawBody present:', !!rawBody);
    
    if (!rawBody) {
      throw new BadRequestException('No raw body available. Make sure rawBody is enabled in NestFactory.');
    }

    return this.stripeService.handleWebhook(signature, rawBody);
  }
}
