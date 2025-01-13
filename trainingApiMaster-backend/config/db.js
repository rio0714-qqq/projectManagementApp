var mongoose = require("mongoose");
const dotenv = require("dotenv");

// 環境変数の読込
dotenv.config({ path: "./config/config.env" });

//DB接続
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  console.log(`<)))><...mongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
