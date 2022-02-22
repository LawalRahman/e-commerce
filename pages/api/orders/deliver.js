import nc from "next-connect";
import Order from "../../../models/Order";
import database from "../../../utils/db";
import onError from "../../../utils/error";
import { isAuth } from "../../../utils/auth";

const handler = nc({
  onError,
});
handler.use(isAuth);
handler.put(async (req, res) => {
  await database.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = await order.save();
    await database.disconnect();
    res.send({ message: "order delivered", order: deliveredOrder });
  } else {
    await database.disconnect();
    res.status(404).send({ message: "order not found" });
  }
});

export default handler;
