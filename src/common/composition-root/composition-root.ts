import "reflect-metadata";
import { Container } from "inversify";
import { InvoicesController } from "../../features/invoices/api/controllers/invoices.controller";
import { InvoicesService } from "../../features/invoices/application/invoices.service";
import { InvoicesQueryRepository } from "../../features/invoices/repositories/invoices.query.repository";
import { InvoicesTransactionRepository } from "../../features/invoices/repositories/invoices.transaction.repository";

export const container = new Container();

container.bind<InvoicesController>(InvoicesController).toSelf();
container.bind<InvoicesService>(InvoicesService).toSelf();
container.bind<InvoicesQueryRepository>(InvoicesQueryRepository).toSelf();
container
  .bind<InvoicesTransactionRepository>(InvoicesTransactionRepository)
  .toSelf();
