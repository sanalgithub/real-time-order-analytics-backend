import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db";
import orderRoutes from "./src/modules/order/orderRoutes";
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Real-Time Order Analytics Backend is running");
});
app.use("/api/orders", orderRoutes);




export default app;