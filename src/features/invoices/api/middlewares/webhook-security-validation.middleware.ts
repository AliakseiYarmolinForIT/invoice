import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { HttpStatus } from "../../../../common/types/http-statuses";
import { createErrorMessages } from "../../../../common/middlewares/input-validation-result.middleware";
import { NonceModel } from "../../domain/nonce-entity";

export async function webhookSecurityValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const signature = Array.isArray(req.headers["x-signature"])
      ? req.headers["x-signature"][0]
      : req.headers["x-signature"];

    const timestamp = Array.isArray(req.headers["x-timestamp"])
      ? req.headers["x-timestamp"][0]
      : req.headers["x-timestamp"];

    const nonce = Array.isArray(req.headers["x-nonce"])
      ? req.headers["x-nonce"][0]
      : req.headers["x-nonce"];

    if (!signature || !timestamp || !nonce) {
      return res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([
            { field: "headers", message: "Missing security headers" },
          ]),
        );
    }

    // проверка x-timestamp основана на допущении, что временная метка приходит в миллисекундах и время актуальности webhook'а составляет 5 минут
    const now = Date.now();

    if (now - parseInt(timestamp) > 300000) {
      return res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([
            { field: "headers", message: "Request too old" },
          ]),
        );
    }

    // запрос в бд для проверки уникальности x-nonce выполнен в обход dal
    const existingNonce = await NonceModel.findOne({ nonce });

    if (existingNonce) {
      return res.send(
        createErrorMessages([
          { field: "headers", message: "Duplicate webhook" },
        ]),
      );
    }

    // проверка x-signature на основе body без x-timestamp и x-nonce согласно ТЗ
    const bodyString = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac("sha256", process.env.WEBHOOK_SECRET!)
      .update(bodyString)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([
            { field: "headers", message: "Invalid signature" },
          ]),
        );
    }

    await NonceModel.create({ nonce });

    next();
  } catch (error) {
    res.status(HttpStatus.InternalServerError);
  }
}
