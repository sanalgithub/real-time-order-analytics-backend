import app from "./app";

const PORT = process.env.PORT;

app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err: any) => {
    console.error("Error starting server:", err);
  });