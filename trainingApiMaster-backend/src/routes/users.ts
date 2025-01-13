import express from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/users";
import { protect, authorizeByRole } from "../middleware/auth";

const router = express.Router();

router.use(protect, authorizeByRole("admin"));

router
  .route("/")
  //METHODS
  .get(getUsers)
  .post(createUser);

router
  .route("/:id")
  // METHODS
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
