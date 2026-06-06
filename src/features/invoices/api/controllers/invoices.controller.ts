import "reflect-metadata";
import { injectable } from "inversify";
import { Request, Response } from "express";
import { InvoicesService } from "../../application/invoices.service";
import { InvoicesQueryRepository } from "../../repositories/invoices.query.repository";
import { CreateInvoiceDto } from "../input-models/create-invoice.dto";
import { UpdateInvoiceDto } from "../input-models/update-invoice.dto";
import { HttpStatus } from "../../../../common/types/http-statuses";
import { createErrorMessages } from "../../../../common/middlewares/input-validation-result.middleware";
import { mapToInvoiceViewModel } from "../mappers/invoice.mapper";

@injectable()
export class InvoicesController {
  constructor(
    protected invoiceService: InvoicesService,
    protected invoiceQueryRepository: InvoicesQueryRepository,
  ) {}

  async getInvoiceById(req: Request<{ id: string }>, res: Response) {
    try {
      const invoice = await this.invoiceQueryRepository.findInvoiceById({
        id: req.params.id,
      });

      if (!invoice) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([
              { field: "id", message: "Invoice not found" },
            ]),
          );
        return;
      }

      const invoiceViewModel = mapToInvoiceViewModel(invoice);

      res.status(HttpStatus.Ok).send(invoiceViewModel);
    } catch (error: unknown) {
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async createInvoice(req: Request<{}, {}, CreateInvoiceDto>, res: Response) {
    try {
      const newInvoiceId = await this.invoiceService.createInvoice({
        amount: req.body.amount,
        currency: req.body.currency,
        merchantId: req.body.merchantId,
      });

      const invoice = await this.invoiceQueryRepository.findInvoiceById({
        id: newInvoiceId,
      });

      const invoiceViewModel = mapToInvoiceViewModel(invoice!);

      return res.status(HttpStatus.Created).send(invoiceViewModel);
    } catch (error: unknown) {
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async processInvoiceWebhook(
    req: Request<{ id: string }, {}, UpdateInvoiceDto>,
    res: Response,
  ) {
    try {
      const result = await this.invoiceService.updateInvoice({
        invoiceId: req.body.invoiceId,
        status: req.body.status,
      });

      if (!result) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([
              { field: "id", message: "Invoice not found" },
            ]),
          );
        return;
      } else {
        return res.sendStatus(HttpStatus.Ok);
      }
    } catch (e: unknown) {
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }
}
