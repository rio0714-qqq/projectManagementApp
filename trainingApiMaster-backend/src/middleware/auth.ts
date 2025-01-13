import jwt from "jsonwebtoken";
import { asyncHandler } from "./async";
import { ErrorResponse } from "../utils/errorResponse";
import User from "../models/users";
import { request } from "express";

interface DecodedJwt {
  id: string;
  iat: string;
  exp: string;
}

/**
 * トークンを検証するミドルウェア
 * Routesに差し込んで使用する
 * 有効なトークンを持っていない場合は401エラーを返す
 */
export const protect = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  let token: string | undefined;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  // if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) return next(new ErrorResponse("Not authorized to access this route", 401));

  try {
    // トークンの検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedJwt;
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

/**
 * 権限を検証するミドルウェア
 * Admin権限でしか実行できない操作がある
 */
export const authorizeByRole = (...roles: string[]) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorResponse(`User role '${req.user.role}' is not authorized to access this route`, 403));
  }
  next();
};
