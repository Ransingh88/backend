import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// generate access and refresh token at a time - helper
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong, while generating access and refresh token",
    );
  }
};

// registering / create user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password, role } = req.body;

  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, `all fields are required`);
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(400, "username or email already exist!");
  }

  const user = await User.create({ username, email, fullName, password, role });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "user registred successfully"));
});

// logging in user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (email == "" && password == "") {
    throw new ApiError(400, "all fiels are required");
  }

  if (!(email && password)) {
    throw new ApiError(400, "all fiels are required");
  }

  const user = await User.findOne({
    $or: [{ username: email }, { email: email }],
  });

  if (!user) {
    throw new ApiError(404, "user doesn't exist!");
  }

  const isPasswordValid = await user.passwordValidate(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedinUser, accessToken, refreshToken },
        "user logged in successfully",
      ),
    );
});

const verifyAuth = asyncHandler((req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "user authenticated"));
});

// logging out user
const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req?.user._id,
    { $unset: { refreshToken: "" } },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

// refresh access token - auto generate accesstoken
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "invalid refresh token");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  console.log(accessToken, newRefreshToken, "]]]]]]]]");
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "access token refreshed",
      ),
    );
});

// chnage current user password
const updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword && !newPassword && !confirmPassword) {
    throw new ApiError(400, "all fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "new and confirm password doesn't match");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "new and old password should not be same");
  }

  const user = await User.findById(req?.user?._id);

  const isPasswordValid = await user.passwordValidate(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "password updated successfully"));
});

// get current user details
const getUserDetails = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "user details fetched successfully"));
});

const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user?._id } });

  if (!users) {
    throw new ApiError(404, "no user found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, users, "all user fetched successfully"));
});

const updateUserAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, username, email } = req.body;

  if (!fullName && !username && !email) {
    throw new ApiError(400, "all fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
        username,
      },
    },
    { new: true },
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, user, "user details updated successfully"));
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  const { confirmDetele } = req.body;

  if (!confirmDetele) {
    throw new ApiError(400, "detlete key field is required");
  }

  if (confirmDetele !== `delete/${req.user?.username}`) {
    throw new ApiError(400, "key doesn't match");
  }

  await User.findByIdAndDelete(req.user?._id);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "account deleted succesfully"));
});

export {
  registerUser,
  loginUser,
  verifyAuth,
  logoutUser,
  refreshAccessToken,
  updateUserPassword,
  getUserDetails,
  updateUserAccountDetails,
  deleteUserAccount,
  getAllUser,
};
