import { hash } from "bcryptjs";
import { Users } from "../models/user";

export const register = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  if (!(firstName || lastName || email || password)) {
    next("Provide Required Fields");
  }
  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("User Already Exist");
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // send email ver
    // sendVerificationEmail(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
