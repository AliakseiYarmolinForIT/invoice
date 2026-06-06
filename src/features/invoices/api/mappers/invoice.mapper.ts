import { WithId } from "mongodb";
import { InvoiceViewModel } from "../view-models/invoice.view-model";
import { Invoice } from "../../domain/invoice-entity";

export function mapToInvoiceViewModel(
  invoice: WithId<Invoice>,
): InvoiceViewModel {
  return {
    id: invoice._id.toString(),
    amount: invoice.amount / 100,
    fee: invoice.fee / 100,
    amountToReceive: invoice.amountToReceive / 100,
    // currenсy не возвращается согласно ТЗ
  };
}
