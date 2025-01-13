import crypto from "crypto";
import User from "../models/users";
import { asyncHandler } from "../middleware/async";
import { ErrorResponse } from "../utils/errorResponse";
import { sendEmail } from "../utils/sendEmail";

/**
 * @desc Register User
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // userの作成
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Token生成
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, data: user, token });
});

/**
 * @desc Login User
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // EmailとPasswordのバリデーション
  if (!email || !password) return next(new ErrorResponse("Please provide an email or a password", 400));

  // userを検索
  const user = await User.findOne({ email }).select("+password");

  // userのバリデーション
  if (!user) return next(new ErrorResponse("Invalid credential", 401));

  // パスワードのチェック
  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) return next(new ErrorResponse("Invalid credential", 401));

  // Token生成
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

/**
 * @desc Get current logged in user
 * @route POST /api/v1/auth/me
 * @access Private
 */
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user?.id);

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Forgot password
 * @route POST /api/v1/auth/forgotpassword
 * @access Public
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new ErrorResponse("There is no user with that email", 404));

  // リセット用トークンの生成
  const resetToken = user.getResetPasswordToken();

  // DBに保存
  await user.save({ validateBeforeSave: false });

  // リセット用エンドポイントの生成
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;

  // メッセージ
  const message = `To reset your password, please make a PUT request to \n\n ${resetUrl}`;

  try {
    await sendEmail({
      to: email,
      subject: "Password Reset Token",
      text: message,
    });

    res.status(200).json({ success: true, data: "Reset email sent", resetUrl });
  } catch (err) {
    console.log(err);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not send", 500));
  }
});

/**
 * @desc Reset password
 * @route POST /api/v1/auth/resetpassword/:resetToken
 * @access Public
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: new Date(Date.now()) } });

  if (!user) return next(new ErrorResponse("Invalid token", 400));

  // 新しいパスワードでDB更新
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, data: user });
});
