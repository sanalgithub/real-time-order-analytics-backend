import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import logger from "../utils/logger";
import Order from "../models/order";

let io: SocketIOServer;

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", 
    },
  });

  io.on("connection", (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on("joinAdmins", () => {
      socket.join("admins");
      logger.info(`Socket ${socket.id} joined admins room`);
    });

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const startLiveOrderCountBroadcast = () => {
  setInterval(async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const count = await Order.countDocuments({
        createdAt: { $gte: fiveMinutesAgo },
      });

      getIO().to("admins").emit("liveOrderCount", {
        count,
        windowMinutes: 5,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error("Error broadcasting live order count:", error);
    }
  }, 10000); 
};
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocket first.");
  }
  return io;
};