import mongoose from "mongoose";
import * as orderRepository from "./orderRepository";
import { OrderDocument } from "../../models/order";
import logger from "../../utils/logger";
import { paginate } from "../../utils/paginate";
import { getIO } from "../../config/socket";

export const createOrder = async (
    orderData: Partial<OrderDocument>,
): Promise<OrderDocument> => {
    try {
        logger.info("Creating a new order", { orderData });

        const newOrder = await orderRepository.create(orderData);

        getIO().to("admins").emit("orderCreated", newOrder);

        return newOrder;
    } catch (error: any) {
        logger.error("Error creating order:", error);
        throw new Error(error.message);
    }
};



export const getAllOrdersForListing = async (
    filters: { status?: string; userId?: string } = {},
    page?: number,
    limit?: number,
): Promise<any> => {
    try {
        return paginate(
            (skip, limit) =>
                orderRepository
                    .getAllOrdersForListing(filters, skip, limit)
                    .then((result) => ({
                        data: result.data,
                        total: result.total,
                    })),
            page,
            limit,
        );
    } catch (error: any) {
        throw new Error(`Error fetching orders: ${error.message}`);
    }
};

export const updateOrderStatus = async (
    id: string,
    status: string,
): Promise<OrderDocument | null> => {
    try {
        logger.info(`Updating status for order with ID ${id} to ${status}`);

        const updatedOrder = await orderRepository.updateStatusById(id, status);

        if (!updatedOrder) {
            throw new Error(`Order with ID ${id} not found`);
        }

        getIO().to("admins").emit("orderStatusUpdated", updatedOrder);

        return updatedOrder;
    } catch (error: any) {
        throw new Error(`Error updating order status: ${error.message}`);
    }
};
const parseRange = (range: string): Date => {
  const match = /^(\d+)([dh])$/.exec(range);
  const now = new Date();

  if (!match) {
    now.setDate(now.getDate() - 7);
    return now;
  }

    const value = parseInt(match[1]!, 10);
  const unit = match[2];

  if (unit === "d") {
    now.setDate(now.getDate() - value);
  } else if (unit === "h") {
    now.setHours(now.getHours() - value);
  }

  return now;
};
export const getSalesSummary = async (range: string) => {
  try {
    logger.info(`Fetching sales summary for range ${range}`);

    const startDate = parseRange(range);
    const summary = await orderRepository.getSalesSummary(startDate);

    return summary;
  } catch (error: any) {
    throw new Error(`Error fetching sales summary: ${error.message}`);
  }
};