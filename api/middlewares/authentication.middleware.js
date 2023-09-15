const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  const bearerToken = req.headers.authorization;

  const token = bearerToken?.split(" ")[1];

  let decodedToken;

  try {
    decodedToken = JWT.verify(token, JWT_SECRET);
    req.userRoles = decodedToken.systemRoles;
  } catch (error) {
    return res.status(403).json({
      message: "INVALID USER",
    });
  }

  if (decodedToken) {
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
