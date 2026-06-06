import "reflect-metadata";
import { container } from "../../../../common/composition-root/composition-root";
import { Router } from "express";
import { InvoicesController } from "../controllers/invoices.controller";
import {
  invoiceAmountValidationMiddleware,
  invoiceCurrencyValidationMiddleware,
  WebhookInvoiceIdValidationMiddleware,
  invoiceMerchantIdValidationMiddleware,
  WebhookInvoiceStatusValidationMiddleware,
} from "../middlewares/invoice-input-dto-validation.middleware";
import { inputValidationResultMiddleware } from "../../../../common/middlewares/input-validation-result.middleware";
import { paramsIdValidationMiddleware } from "../../../../common/middlewares/params-id-validation.middleware";
import { webhookSecurityValidationMiddleware } from "../middlewares/webhook-security-validation.middleware";

const paymentsController = container.get(InvoicesController);

export const invoiceRouter = Router({});

invoiceRouter.post(
  "",
  invoiceAmountValidationMiddleware,
  invoiceCurrencyValidationMiddleware,
  invoiceMerchantIdValidationMiddleware,
  inputValidationResultMiddleware,
  paymentsController.createInvoice.bind(paymentsController),
);
invoiceRouter.post(
  "/webhook",
  webhookSecurityValidationMiddleware,
  WebhookInvoiceIdValidationMiddleware,
  WebhookInvoiceStatusValidationMiddleware,
  inputValidationResultMiddleware,
  paymentsController.processInvoiceWebhook.bind(paymentsController),
);
invoiceRouter.get(
  "/:id",
  paramsIdValidationMiddleware,
  inputValidationResultMiddleware,
  paymentsController.getInvoiceById.bind(paymentsController),
);
