const JWT = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  const bearerToken = req.headers.authorization;

  const token = bearerToken?.split(" ")[1];

  let decodedToken;

  try {
    decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return res.status(403).json({
      message: "INVALID USER",
    });
  }

  if (decodedToken) {
    req.body.userId = decodedToken._id;
    next();
  } else {
    return res.status(404).json({
      message: "INVALID USER",
    });
  }
};

module.exports = {
  authentication,
};
