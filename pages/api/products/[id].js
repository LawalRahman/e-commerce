import nc from "next-connect";
import Product from "../../../models/Product";
import database from "../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  await database.connect();
  const product = await Product.findById(req.query.id);
  database.disconnect();
  res.send(product);
});

export default handler;
