const JWT = require("jsonwebtoken");

const signToken = async (userId) => {
  const tokenData = {
    _id: userId,
  };

  const signedToken = await JWT.sign(tokenData, process.env.JWT_SECRET_KEY);
  return signedToken;
};

module.exports = {
  signToken,
};
