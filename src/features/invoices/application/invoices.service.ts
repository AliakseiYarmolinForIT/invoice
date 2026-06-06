import "reflect-metadata";
import { inject, injectable } from "inversify";
import { InvoicesTransactionRepository } from "../repositories/invoices.transaction.repository";
import { UpdateInvoiceDto } from "../api/input-models/update-invoice.dto";
import { CreateInvoiceDto } from "../api/input-models/create-invoice.dto";
import { InvoiceModel } from "../domain/invoice-entity";

@injectable()
export class InvoicesService {
  constructor(
    @inject(InvoicesTransactionRepository)
    protected invoicesRepository: InvoicesTransactionRepository,
  ) {}

  async createInvoice({
    amount,
    currency,
    merchantId,
  }: CreateInvoiceDto): Promise<string> {
    // т.к. процент комиссии зависит от merchant, то должно быть обращение в бд для получения значения этого процента.
    // в текущем случае значение взято условно, т.к. реальной интеграции нет.
    // все расчёты производятся в минимальных денежных единицах, т.е. копейках | центах
    const amountCents = Math.round(amount * 100);
    const feePercent = 5;
    const fee = Math.floor((amountCents * feePercent) / 100);
    const amountToReceive = amountCents - fee;

    const invoice = InvoiceModel.createInvoice({
      amount: amountCents,
      fee,
      amountToReceive,
      currency,
      merchantId,
    });

    // тут должна быть реализована отправка запроса провайдеру, исходя из того, какое значение merchantId было получено.
    // в ответ на этот запрос будет получаться webhook

    return await this.invoicesRepository.createInvoice(invoice);
  }

  async updateInvoice({ invoiceId, status }: UpdateInvoiceDto): Promise<void> {
    await this.invoicesRepository.updateInvoiceStatus({ invoiceId, status });
  }
}
