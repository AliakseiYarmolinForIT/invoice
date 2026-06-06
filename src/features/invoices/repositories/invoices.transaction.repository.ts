import "reflect-metadata";
import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import {
  InvoiceDocument,
  InvoiceModel,
  InvoiceStatusEnum,
} from "../domain/invoice-entity";
import { UpdateInvoiceDto } from "../api/input-model/update-invoice.dto";

@injectable()
export class InvoicesTransactionRepository {
  async createInvoice(invoice: InvoiceDocument): Promise<string> {
    const result = await invoice.save();

    return result._id.toString();
  }

  async updateInvoiceStatus({
    invoiceId,
    status,
  }: UpdateInvoiceDto): Promise<void> {
    await InvoiceModel.updateOne(
      { _id: new ObjectId(invoiceId), status: InvoiceStatusEnum.PENDING },
      { status },
    );
  }

  public async findInvoiceById({
    id,
  }: {
    id: string;
  }): Promise<InvoiceDocument | null> {
    return await InvoiceModel.findOne({ _id: id }).exec();
  }
}
