import { InvoiceCurrencyEnum } from "../../domain/invoice-entity";

export class CreateInvoiceDto {
  constructor(
    public amount: number,
    public currency: InvoiceCurrencyEnum,
    public merchantId: string,
  ) {}
}
