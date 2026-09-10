import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../constants/httpStatusCode";
import { message } from "../../constants/responseMessage";
import logger from "../../utils/logger";
import * as orderService from "./orderService";
import { validationResult } from "express-validator";


export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
};


export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.createOrder(req.body);

    return res.status(HttpStatusCode.CREATED).json({
      message: message.ORDER_CREATED,
      data: order,
    });
  } catch (error: any) {
    logger.error("Error in createOrder controller:", error);
    return res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const { status, userId, page, limit } = req.query;

        const result = await orderService.getAllOrdersForListing(
            {
                status: status as string,
                userId: userId as string,
            },
            Number(page) || undefined,
            Number(limit) || undefined,
        );

        return res.status(HttpStatusCode.OK).json(result);
    } catch (error: any) {
        logger.error("Error in getOrders controller:", error);
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: message.ORDER_FETCH_FAILED, error: error.message });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const status = req.body.status as string;


        const updatedOrder = await orderService.updateOrderStatus(id, status);

        return res.status(HttpStatusCode.OK).json({
            message: message.ORDER_UPDATED,
            data: updatedOrder,
        });
    } catch (error: any) {
        logger.error("Error in updateOrderStatus controller:", error);
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
    }
};

export const getSalesSummary = async (req: Request, res: Response) => {
    try {
        const range = (req.query.range as string) || "7d";

        const summary = await orderService.getSalesSummary(range);

        return res.status(HttpStatusCode.OK).json(summary);
    } catch (error: any) {
        logger.error("Error in getSalesSummary controller:", error);
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: message.SALES_SUMMARY_FETCH_FAILED, error: error.message });
    }
};