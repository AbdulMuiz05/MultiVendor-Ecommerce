const mongoose = require("mongoose");

let connectionPromise;

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((connection) => {
        console.log(
          `MongoDB connected with server: ${connection.connection.host}`
        );
        return connection.connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw new Error(`MongoDB connection error: ${error.message}`);
      });
  }

  return connectionPromise;
};

module.exports = connectDatabase;
