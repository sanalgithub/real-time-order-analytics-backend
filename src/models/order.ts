import mongoose, { Schema, Document, Types } from "mongoose";
import { OrderStatus } from "../constants/enum";



export interface OrderItem {
  productName: string;
  qty: number;
  price: number;
}

export interface Order {
  _id: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}

export type OrderDocument = Order & Document;

const OrderSchema: Schema<OrderDocument> = new Schema({

  items: [
    {
      productName: { type: String, required: true },
      qty: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
      _id: false,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

OrderSchema.index({ userId: 1, status: 1, createdAt: 1 });

export default mongoose.model<OrderDocument>("Order", OrderSchema);