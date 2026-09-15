const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error(
    "ERROR:",
    err
  );

  let statusCode =
    res.statusCode !== 200
      ? res.statusCode
      : 500;

  let message =
    err.message ||
    "Internal Server Error";

  // Mongoose validation error
  if (
    err.name ===
    "ValidationError"
  ) {
    statusCode = 400;

    message = Object.values(
      err.errors
    )
      .map(
        (error) => error.message
      )
      .join(", ");
  }

  // Invalid MongoDB ObjectId
  if (
    err.name ===
    "CastError"
  ) {
    statusCode = 400;
    message =
      "Invalid resource ID.";
  }

  // Duplicate MongoDB key
  if (
    err.code === 11000
  ) {
    statusCode = 400;
    message =
      "A record with this information already exists.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports =
  errorMiddleware;