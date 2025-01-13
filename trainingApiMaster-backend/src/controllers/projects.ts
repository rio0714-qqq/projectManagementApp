import Project from "../models/projects";
import { asyncHandler } from "../middleware/async";

/**
 * @desc Get all projects
 * @route GET /api/v1/projects
 * @access Public
 */
export const getProjects = asyncHandler(async (req, res, next) => {
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  const projects = await Project.find(JSON.parse(queryStr)).populate("assignees");

  res.status(200).json({ success: true, count: projects.length, data: projects });
});

/**
 * @desc Get one project
 * @route GET /api/v1/projects/:id
 * @access Private
 */
export const getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate("assignees");

  res.status(200).json({ success: true, data: project });
});

/**
 * @desc Create new project
 * @route POST /api/v1/projects
 * @access Private
 */
export const createProject = asyncHandler(async (req, res, next) => {
  const project = await Project.create(req.body);

  res.status(201).json({ success: true, data: project });
});

/**
 * @desc Update a project
 * @route PUT /api/v1/projects/:id
 * @access Private
 */
export const updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: project });
});

/**
 * @desc Delete a project
 * @route DELETE /api/v1/projects/:id
 * @access Private
 */
export const deleteProject = asyncHandler(async (req, res, next) => {
  await Project.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true });
});
