import { runDb } from "./common/db/run-db";
import { app } from "./setup-app";

const port = process.env.PORT || 3000;

const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });
};

startApp();
