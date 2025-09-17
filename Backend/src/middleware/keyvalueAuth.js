// middleware/keyValueAuth.js
import dotenv from 'dotenv';
dotenv.config();

export default function keyValueAuth(req, res, next) {
  // console.log(req.headers)
  const clientKey = req.headers["api_key"];

  // console.log(clientKey);

  if (
    !clientKey || clientKey !== process.env.API_KEY
  ) {
    return res.status(401).json({ error: "Unauthorized - Invalid Key/Value" });
  }

  next();
}

