import { Request, Response, NextFunction } from "express";
import { IUserDocument } from "../models/users";

interface IRequest extends Request {
  user?: IUserDocument | null;
}

type AsyncFunc = (req: IRequest, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (asyncFunc: AsyncFunc) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(asyncFunc(req, res, next)).catch(next);
