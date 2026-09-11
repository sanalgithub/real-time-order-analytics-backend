import http from "http";
import app from "./app";
import { connectDB } from "./src/config/db";
import { initSocket, startLiveOrderCountBroadcast } from "./src/config/socket";

const PORT = process.env.PORT;

const server = http.createServer(app);

const startServer = async () => {
  await connectDB(); 

  initSocket(server);
  startLiveOrderCountBroadcast();

  server
    .listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
    .on("error", (err: any) => {
      console.error("Error starting server:", err);
    });
};

startServer();