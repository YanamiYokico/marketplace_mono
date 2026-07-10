import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';
import Stripe from 'stripe';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private endpointSecret: string;
  private frontendUrl: string;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private configService: ConfigService,
    private ordersService: OrdersService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      this.logger.warn('STRIPE_SECRET_KEY is not defined. Stripe will not work properly.');
    }

    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2026-05-27.dahlia' as any,
      });
    }
    this.endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';
  }

  async createCheckoutSession(userId: string, orderId: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured on this server');
    }

    const order = await this.ordersService.getOrderById(userId, orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not in PENDING status');
    }

    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          images: item.product.imageUrl ? [item.product.imageUrl] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${this.frontendUrl}/orders?payment=success`,
        cancel_url: `${this.frontendUrl}/orders?payment=canceled`,
        metadata: {
          orderId: order.id,
          userId: userId,
        },
      });

      return { url: session.url };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error creating stripe session: ${message}`);
      throw new BadRequestException('Could not create payment session');
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, this.endpointSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Webhook signature verification failed: ${message}`);
      throw new BadRequestException(`Webhook Error: ${message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;

      if (orderId && userId) {
        this.logger.log(`Payment successful for order ${orderId}. Updating status...`);
        try {
          // Update order status to PAID
          await this.ordersService.payOrder(userId, orderId);
          this.logger.log(`Order ${orderId} successfully marked as PAID.`);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          this.logger.error(`Failed to update order ${orderId} to PAID: ${message}`);
        }
      }
    }

    return { received: true };
  }
}
