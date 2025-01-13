import User from "../models/users";
import { asyncHandler } from "../middleware/async";
import { ErrorResponse } from "../utils/errorResponse";

/**
 * @desc Get all users
 * @route GET /api/v1/users
 * @access Private/admin
 */
export const getUsers = asyncHandler(async (req, res, next) => {
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  const users = await User.find(JSON.parse(queryStr));

  res.status(200).json({ success: true, count: users.length, data: users });
});

/**
 * @desc Get single users
 * @route GET /api/v1/users/:id
 * @access Private/admin
 */
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Create users
 * @route POST /api/v1/users
 * @access Private/admin
 */
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

/**
 * @desc Update users
 * @route PUT /api/v1/users/:id
 * @access Private/admin
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Delete users
 * @route DELETE /api/v1/users/:id
 * @access Private/admin
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true });
});
