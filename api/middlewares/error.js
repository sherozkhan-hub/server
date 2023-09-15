const errorMiddleware = (err, req, res, next) => {
  const defaultError = {
    status: 404,
    success: "failed",
    message: err,
  };

  if (err?.name === "ValidateError") {
    defaultError.status = 404;

    defaultError.message = Object.values(err, errors)
      .map((val) => val.message)
      .join(",");
  }

  if (err.code && err.code === 11000) {
    defaultError.status = 404;
    defaultError.message = `${Object.values(
      err.keyValue
    )} field has to be unique`;
  }

  res.status(defaultError.statusCode).json({
    success: defaultError.success,
    message: defaultError.message,
  });
};

export default errorMiddleware;
