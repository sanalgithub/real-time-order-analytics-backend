import mongoose from "mongoose";
import * as orderRepository from "./orderRepository";
import { OrderDocument } from "../../models/order";
import logger from "../../utils/logger";
import { paginate } from "../../utils/paginate";

export const createOrder = async (
    orderData: Partial<OrderDocument>,
): Promise<OrderDocument> => {
    try {
        logger.info("Creating a new order", { orderData });

        const newOrder = await orderRepository.create(orderData);

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

        return updatedOrder;
    } catch (error: any) {
        throw new Error(`Error updating order status: ${error.message}`);
    }
};

export const getSalesSummary = async (range: string) => {
    try {
        logger.info(`Fetching sales summary for range ${range}`);

        const summary = await orderRepository.getSalesSummary(new Date(range));

        return summary;
    } catch (error: any) {
        throw new Error(`Error fetching sales summary: ${error.message}`);
    }
};