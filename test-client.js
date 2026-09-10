const { io } = require("socket.io-client");

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected:", socket.id);
  socket.emit("joinAdmins");
});

socket.on("orderCreated", (order) => {
  console.log("Order created:", order);
});

socket.on("orderStatusUpdated", (order) => {
  console.log("Order status updated:", order);
});

socket.on("liveOrderCount", (data) => {
  console.log("Live order count (last 5 min):", data);
});