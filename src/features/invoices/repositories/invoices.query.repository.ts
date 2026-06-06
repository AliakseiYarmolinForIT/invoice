import "reflect-metadata";
import { ObjectId, WithId } from "mongodb";
import { injectable } from "inversify";
import { Invoice, InvoiceModel } from "../domain/invoice-entity";

@injectable()
export class InvoicesQueryRepository {
  public async findInvoiceById({
    id,
  }: {
    id: string;
  }): Promise<WithId<Invoice> | null> {
    let invoice = await InvoiceModel.findOne({
      _id: new ObjectId(id),
    }).lean();

    return invoice;
  }
}
