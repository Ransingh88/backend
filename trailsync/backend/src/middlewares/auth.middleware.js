import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// verify user is logged in or not. Or JWT is valid or not
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "unauthorized token! please login to access");
  }

  const decodedJWT = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedJWT?._id).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw new ApiError(401, "user not loggedin! invalid access token");
  }

  req.user = user;
  next();
});

// validated roles are authorize to the resources or not
export const authorizedRoles = (roles) => {
  console.log(roles, "rolesss");
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new ApiError(
        403,
        `Role: '${req.user.role}', you are not allowed to access this resource.`,
      );
    }
    next();
  });
};
