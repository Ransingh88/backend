// const asyncHandler = (requestHandler) => async (req, res, next) => {
//   try {
//     await requestHandler(req, res, next);
//   } catch (error) {
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "an unexpected error occurred",
      });
      next(err);
    });
  };
};

export { asyncHandler };
