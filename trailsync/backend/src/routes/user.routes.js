import { Router } from "express";
import {
  deleteUserAccount,
  getAllUser,
  getUserDetails,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAccountDetails,
  updateUserPassword,
} from "../controllers/user.controller.js";
import { authorizedRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshAccessToken").post(refreshAccessToken);
router.route("/updatePassword").post(verifyJWT, updateUserPassword);
router.route("/me").get(verifyJWT, getUserDetails);
router.route("/updateAcountDetails").patch(verifyJWT, updateUserAccountDetails);
router.route("/deleteAcount").delete(verifyJWT, deleteUserAccount);
router.route("/allUser").get(verifyJWT, authorizedRoles(["admin"]), getAllUser);

export default router;
