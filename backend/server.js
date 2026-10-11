require("dotenv").config({
  path: "./config/.env",
});

const app = require("./app");

const PORT = process.env.PORT || 8000;

if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  process.on("uncaughtException", (error) => {
    console.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
  });

  process.on("unhandledRejection", (error) => {
    console.error(`Unhandled Promise Rejection: ${error.message}`);

    server.close(() => {
      process.exit(1);
    });
  });
}

module.exports = app;
