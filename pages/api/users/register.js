import bcrypt from "bcryptjs";
import nc from "next-connect";
import User from "../../../models/User";
import { signToken } from "../../../utils/auth";
import database from "../../../utils/db";

const handler = nc();

handler.post(async (req, res) => {
  await database.connect();
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  });
  const user = await newUser.save();
  database.disconnect();

  const token = signToken(user);
  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
