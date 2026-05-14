import "dotenv/config";
import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";

const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MONGO_URI is required");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is required");
  process.exit(1);
}

await connectDb(mongoUri);
const app = createApp();
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
