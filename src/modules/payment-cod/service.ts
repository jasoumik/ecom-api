/**
 * COD Payment Provider for Medusa v2
 *
 * Cash on Delivery — payment is collected when the order is delivered.
 * This provider:
 *   - Initiates a payment session immediately (no external gateway call)
 *   - Authorizes the payment (marks COD as confirmed by customer)
 *   - Captures payment when order is marked as delivered
 *
 * Provider ID: pp_payment-cod_cod
 * See MEDUSA_MIGRATION.md — Phase 2
 */

import { AbstractPaymentProvider, PaymentSessionStatus } from '@medusajs/framework/utils'
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from '@medusajs/framework/types'

class CodPaymentService extends AbstractPaymentProvider {
  static identifier = 'cod'

  constructor(container: Record<string, unknown>, options?: Record<string, unknown>) {
    super(container, options)
  }

  /**
   * Called when customer reaches the payment step in checkout.
   * COD needs no external session — return immediately as pending.
   */
  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    return {
      id: `cod_${Date.now()}`,
      data: {
        method: 'cash_on_delivery',
        status: 'pending',
        amount: input.amount,
        currency_code: input.currency_code,
      },
    }
  }

  /**
   * Called when customer confirms the order.
   * COD is always authorized — customer will pay on delivery.
   */
  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    return {
      status: PaymentSessionStatus.AUTHORIZED,
      data: {
        ...(input.data as Record<string, unknown>),
        authorized_at: new Date().toISOString(),
      },
    }
  }

  /**
   * Called when order is marked as delivered — payment collected.
   */
  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return {
      data: {
        ...(input.data as Record<string, unknown>),
        captured_at: new Date().toISOString(),
        capture_method: 'cash_on_delivery',
      },
    }
  }

  /**
   * Called when order is cancelled before delivery.
   */
  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return {
      data: {
        ...(input.data as Record<string, unknown>),
        cancelled_at: new Date().toISOString(),
      },
    }
  }

  /**
   * COD refunds are manual (cash returned to customer in person).
   * Mark as refunded with a note.
   */
  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    return {
      data: {
        ...(input.data as Record<string, unknown>),
        refunded_at: new Date().toISOString(),
        refund_method: 'manual_cash',
        refund_amount: input.amount,
      },
    }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return { data: input.data as Record<string, unknown> }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return { data: input.data as Record<string, unknown> }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data as Record<string, unknown> }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const data = input.data as Record<string, unknown>

    if (data.captured_at) return { status: PaymentSessionStatus.CAPTURED }
    if (data.cancelled_at) return { status: PaymentSessionStatus.CANCELED }
    if (data.authorized_at) return { status: PaymentSessionStatus.AUTHORIZED }

    return { status: PaymentSessionStatus.PENDING }
  }

  async getWebhookActionAndData(): Promise<WebhookActionResult> {
    // COD has no webhooks
    return {
      action: 'not_supported' as any,
      data: { session_id: '', amount: 0 },
    }
  }
}

export default CodPaymentService
