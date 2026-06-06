import { body } from "express-validator";
import { InvoiceCurrencyEnum } from "../../domain/invoice-entity";
import { WebhookInvoiceStatusEnum } from "../input-models/update-invoice.dto";

export const invoiceAmountValidationMiddleware = body("amount")
  .exists()
  .withMessage("Amount is required")
  .notEmpty()
  .withMessage("Amount cannot be empty")
  .isNumeric()
  .withMessage("Amount must be a number")
  .custom((value) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      throw new Error("Amount must be a positive number");
    }
    return true;
  })
  .custom((value) => {
    const str = value.toString();
    if (str.includes(".") && str.split(".")[1].length > 2) {
      throw new Error("Amount must have at most 2 decimal places");
    }
    return true;
  })
  .isFloat({ min: 0.01, max: 999999999.99 })
  .withMessage("Amount must be between 0.01 and 999,999,999.99");

export const invoiceCurrencyValidationMiddleware = body("currency")
  .exists()
  .withMessage("Currency is required")
  .notEmpty()
  .withMessage("Currency cannot be empty")
  .isString()
  .withMessage("Currency must be a string")
  .trim()
  .custom((value) => {
    if (!Object.values(InvoiceCurrencyEnum).includes(value)) {
      throw new Error(
        `Currency must be one of: ${Object.values(InvoiceCurrencyEnum).join(", ")}`,
      );
    }
    return true;
  });

// основано на том, что merchantId - это внутренний идентификатор merchant'а, т.е. ObjectId
export const invoiceMerchantIdValidationMiddleware = body("merchantId")
  .exists()
  .withMessage("MerchantId is required")
  .notEmpty()
  .withMessage("MerchantId cannot be empty")
  .isString()
  .withMessage("MerchantId must be a string")
  .isMongoId()
  .withMessage("Incorrect format of ObjectId");

export const WebhookInvoiceIdValidationMiddleware = body("invoiceId")
  .exists()
  .withMessage("InvoiceId is required")
  .notEmpty()
  .withMessage("InvoiceId cannot be empty")
  .isString()
  .withMessage("InvoiceId must be a string")
  .isMongoId()
  .withMessage("Incorrect format of ObjectId");

export const WebhookInvoiceStatusValidationMiddleware = body("status")
  .exists()
  .withMessage("Status is required")
  .notEmpty()
  .withMessage("Status cannot be empty")
  .isString()
  .withMessage("Status must be a string")
  .trim()
  .custom((value) => {
    if (!Object.values(WebhookInvoiceStatusEnum).includes(value)) {
      throw new Error(
        `Status must be one of: ${Object.values(WebhookInvoiceStatusEnum).join(", ")}`,
      );
    }
    return true;
  });
