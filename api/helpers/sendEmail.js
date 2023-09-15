export const resetPasswordLink = async (user, res) => {
  const { email, _id } = user;

  const token = _id + uuidv4();

  const link = APP_URL + "users/reset-password" + _id + "/" + token;
};
