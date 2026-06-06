import express from "express";
import { invoiceRouter } from "./features/invoices/api/routers/invoices.router";
import { setupSwagger } from "./common/swagger/setup-swagger";

export const initApp = () => {
  const app = express();

  app.use(express.json());
  app.use("/api/invoices", invoiceRouter);

  setupSwagger(app);

  return app;
};

export const app = initApp();
