import { Router } from "express";
import { changeCurrentPassword, getCurrentUserDetails, getUserChannelProfileDetails, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserAvatar, updateUserCoverImage, updateUserDetails } from "../controllers/user.controller.js";
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
router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshtoken").post(refreshAccessToken);
router.route("/updateUserPassword").post(verifyJWT, changeCurrentPassword)
router.route("/getCurrentUser").get(verifyJWT, getCurrentUserDetails)
router.route("/updateCurrentUser").post(verifyJWT, updateUserDetails)
router.route("/updateUserAvatar").post(verifyJWT, updateUserAvatar)
router.route("/updateUserCoverImage").post(verifyJWT, updateUserCoverImage)
router.route("/getUserChannelDetails").get(verifyJWT,getUserChannelProfileDetails)

export default router;
