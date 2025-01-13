import express from "express";
import { getProjects, getProject, createProject, updateProject, deleteProject } from "../controllers/projects";
import { protect } from "../middleware/auth";

const router = express.Router();

// JWTがないとアクセスできない
router.use(protect);

router
  .route("/")
  //METHODS
  .get(getProjects)
  .post(createProject);

router
  .route("/:id")
  // METHODS
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

export default router;
