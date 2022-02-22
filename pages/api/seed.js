import nc from "next-connect";
import Product from "../../models/Product";
import database from "../../utils/db";
import data from "../../utils/data";
import User from "../../models/User";

const handler = nc();

handler.get(async (req, res) => {
  await database.connect();
  await User.deleteMany({});
  await User.insertMany(data.users);
  await Product.deleteMany({});
  await Product.insertMany(data.products);
  database.disconnect();
  res.send({ message: "seeded successfully" });
});

export default handler;
