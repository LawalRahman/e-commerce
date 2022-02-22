// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import database from "../../utils/db";

export default async function handler(req, res) {
  // await database.connect();
  // await database.disconnect();
  res.status(200).json({ name: "John Doe" });
}
