import nc from "next-connect";
import Order from "../../../models/Order";
import database from "../../../utils/db";
import { onError } from "../../../utils/error";
import { isAuth } from "../../../utils/auth";

const handler = nc({
  onError,
});
handler.use(isAuth);
handler.put(async (req, res) => {
  await database.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    await database.disconnect();
    res.send({ message: "order paid", order: paidOrder });
  } else {
    await database.disconnect();
    res.status(404).send({ message: "order not found" });
  }
});

export default handler;
