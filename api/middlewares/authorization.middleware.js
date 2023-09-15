const authorization = async (req, res, next) => {
  const roles = req.userRoles;

  if (roles?.some((systemRole) => systemRole.role === "ADMIN")) {
    next();
  } else {
    return res.status(401).json({
      message: "UN_AUTHORIZED",
    });
  }
};

module.exports = {
  authorization,
};
