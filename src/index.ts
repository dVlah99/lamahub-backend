import express, { Router } from "express";
import cors from "cors";
import jsonControlRouter from "./routes/jsonControlRouter";
import { errorHandler } from "./errorHandler";
import * as dotenv from "dotenv";

const app = express();
app.use(express.json());
const port = 3004;
dotenv.config();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["*"],
  })
);

app.use("/jsonControl", jsonControlRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
  console.log("process: ", process.env.NODE_ENV);
});
