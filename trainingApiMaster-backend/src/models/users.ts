import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export interface IUserDocument extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please add an Email"],
    match: [
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Please use a valid email address",
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * パスワードの暗号化
 */
UserSchema.pre<IUserDocument>("save", async function (next) {
  // パスワードに変更がない場合: 暗号化処理はする必要がない
  if (!this.isModified("password")) next();

  // 新しいパスワードを設定する場合: 暗号化する
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * パスワードの突合
 */
UserSchema.methods.matchPassword = async function (this: any, enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * JWTの生成
 */
UserSchema.methods.getSignedJwtToken = function (this: any) {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRED });
};

/**
 * パスワードリセット用トークンの生成
 * トークンはハッシュ化する
 */
UserSchema.methods.getResetPasswordToken = function (this: any) {
  // トークン生成
  const resetToken = crypto.randomBytes(20).toString("hex");

  // ハッシュ
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // 有効期限の設定（10分）
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model<IUserDocument>("User", UserSchema);
