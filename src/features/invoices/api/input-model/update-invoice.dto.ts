export enum WebhookInvoiceStatusEnum {
  PAID = "paid",
  FAILED = "failed",
}

export class UpdateInvoiceDto {
  constructor(
    public invoiceId: string,
    public status: WebhookInvoiceStatusEnum,
  ) {}
}
