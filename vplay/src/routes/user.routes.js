import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUserDetails,
  getUserChannelProfileDetails,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAvatar,
  updateUserCoverImage,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser,
);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshtoken").post(refreshAccessToken);
router.route("/updatePassword").post(verifyJWT, changeCurrentPassword);
router.route("/getUserDetails").get(verifyJWT, getCurrentUserDetails);
router.route("/updateUserDetails").patch(verifyJWT, updateUserDetails);
router.route("/updateAvatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/updateCoverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/channel/:username").get(verifyJWT, getUserChannelProfileDetails);
router.route("/getWatchHistory").get(verifyJWT,getWatchHistory)

export default router;
