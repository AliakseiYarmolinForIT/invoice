import * as mongoose from "mongoose";
import { HydratedDocument, model, Model } from "mongoose";

export enum InvoiceCurrencyEnum {
  USD = "usd",
  RUB = "rub",
  BYN = "byn",
}

export enum InvoiceStatusEnum {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export type Invoice = {
  amount: number;
  fee: number;
  amountToReceive: number;
  currency: InvoiceCurrencyEnum;
  status: InvoiceStatusEnum;
  merchantId: string;
  createdAt: Date;
  updatedAt: Date;
};

type InvoiceStatics = typeof invoiceStatics;

type InvoiceModel = Model<Invoice> & InvoiceStatics;

export type InvoiceDocument = HydratedDocument<Invoice>;

const invoiceSchema = new mongoose.Schema<Invoice, InvoiceModel>(
  {
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    amountToReceive: { type: Number, required: true },
    currency: { type: String, enum: InvoiceCurrencyEnum, required: true },
    status: { type: String, enum: InvoiceStatusEnum, required: true },
    merchantId: { type: String, required: true },
  },
  { timestamps: true },
);

const invoiceStatics = {
  createInvoice({
    amount,
    fee,
    amountToReceive,
    currency,
    merchantId,
  }: {
    amount: number;
    fee: number;
    amountToReceive: number;
    currency: InvoiceCurrencyEnum;
    merchantId: string;
  }) {
    const invoice = new InvoiceModel() as InvoiceDocument;
    invoice.amount = amount;
    invoice.fee = fee;
    invoice.amountToReceive = amountToReceive;
    invoice.currency = currency;
    invoice.status = InvoiceStatusEnum.PENDING;
    invoice.merchantId = merchantId;

    return invoice;
  },
};

invoiceSchema.statics = invoiceStatics;

export const InvoiceModel = model<Invoice, InvoiceModel>(
  "invoices",
  invoiceSchema,
);
