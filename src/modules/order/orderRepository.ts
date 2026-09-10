import mongoose from "mongoose";
import Order,{ OrderDocument } from "../../models/order";

export const create = async (
  orderData: Partial<OrderDocument>,
): Promise<OrderDocument> => {
  const order = new Order(orderData);
  return await order.save();
};



export const getAllOrdersForListing = async (
  filters: {
    status?: string;
    userId?: string;
  },
  skip: number,
  limit: number,
): Promise<{ data: OrderDocument[]; total: number }> => {
  const matchStages: any = {};

  if (filters.status) {
    matchStages.status = filters.status;
  }

  if (filters.userId) {
    matchStages.userId = filters.userId;
  }

  skip = Math.max(0, skip);

  const total = await Order.countDocuments(matchStages);

  const data = await Order.find(matchStages)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();

  return { total, data };
};

export const updateStatusById = async (
  id: string,
  status: string,
): Promise<OrderDocument | null> => {
  return Order.findByIdAndUpdate(
    id,
    {
      $set: {
        status,
      },
    },
    { new: true, runValidators: true },
  ).exec();
};

export const getSalesSummary = async (startDate: Date) => {
  const matchStage = { createdAt: { $gte: startDate } };

  const dailyStats = await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: 1,
        orderCount: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $match: matchStage },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productName",
        totalQtySold: { $sum: "$items.qty" },
      },
    },
    {
      $project: {
        _id: 0,
        productName: "$_id",
        totalQtySold: 1,
      },
    },
    { $sort: { totalQtySold: -1 } },
    { $limit: 5 },
  ]);

  const avgOrderValueResult = await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        avgOrderValue: { $avg: "$totalAmount" },
      },
    },
    {
      $project: {
        _id: 0,
        avgOrderValue: 1,
      },
    },
  ]);

  const statusCounts = await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
    { $sort: { status: 1 } },
  ]);

  return {
    dailyStats,
    topProducts,
    avgOrderValue: avgOrderValueResult[0]?.avgOrderValue || 0,
    statusCounts,
  };
};