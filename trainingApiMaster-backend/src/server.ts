import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
//
import connectDB from "../config/db";
import projects from "./routes/projects";
import users from "./routes/users";
import auth from "./routes/auth";
import { errorHandler } from "./middleware/error";

/**
 * 環境変数の読込
 */
dotenv.config({ path: "./config/config.env" });

/**
 * DB接続
 */
connectDB();

/**
 * サーバインスタンス
 */
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*'
}));

/**
 * セキュリティミドルウェア
 */
// Prevent NoSQL Injection
app.use(mongoSanitize());
// Set Security Headers
app.use(helmet());
// Prevent XSS Attacks
app.use(xss());
// Prevent http param pollutions
app.use(hpp());
// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 60, // limit each IP to 60 requests per windowMs
});
app.use(limiter);

/**
 * 開発環境: ログの有効化
 */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/**
 * ルーティングの設定
 */
app.use("/api/v1/projects", projects);
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);

/**
 * エラーハンドラー
 */
app.use(errorHandler);

/**
 * サーバーの起動
 */
const server = app.listen(process.env.PORT || 3000, () =>
  console.log(`<)))><...${process.env.NODE_ENV} server is listening on PORT: ${process.env.PORT}`)
);

/**
 * Handle Unhandled Rejections
 */
process.on("unhandledRejection", (err, promise) => {
  console.log("<)))><...Error: unhandledRejection", err);

  server.close(() => process.exit(1));
});
