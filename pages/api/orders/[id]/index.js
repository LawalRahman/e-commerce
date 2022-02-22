import nc from "next-connect";
import Order from "../../../../models/Order";
import database from "../../../../utils/db";
import { isAuth } from "../../../../utils/auth";

const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  await database.connect();
  const order = await Order.findById(req.query.id);
  await database.disconnect();
  res.send(order);
});

export default handler;
