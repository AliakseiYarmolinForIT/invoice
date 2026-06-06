import * as mongoose from "mongoose";
import { HydratedDocument, model, Model } from "mongoose";
// import { WebhookInvoiceStatusEnum } from "../api/input-model/update-invoice.dto";

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

// type InvoiceMethods = typeof invoiceMethods;
type InvoiceStatics = typeof invoiceStatics;

type InvoiceModel = Model<Invoice /* , {}, InvoiceMethods */> & InvoiceStatics;

export type InvoiceDocument = HydratedDocument<Invoice /* , InvoiceMethods */>;

const invoiceSchema = new mongoose.Schema<
  Invoice,
  InvoiceModel /* ,
  InvoiceMethods */
>(
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

// const invoiceMethods = {
//   changeInvoiceStatus({ status }: { status: WebhookInvoiceStatusEnum }) {
//     const statusMap = {
//       [WebhookInvoiceStatusEnum.PAID]: InvoiceStatusEnum.PAID,
//       [WebhookInvoiceStatusEnum.FAILED]: InvoiceStatusEnum.FAILED,
//     };

//     (this as InvoiceDocument).status = statusMap[status];
//   },
// };

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

// invoiceSchema.methods = invoiceMethods;
invoiceSchema.statics = invoiceStatics;

export const InvoiceModel = model<Invoice, InvoiceModel>(
  "invoices",
  invoiceSchema,
);
