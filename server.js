import { config } from "dotenv";
import app from "./app.js";
import connectionToDb from "./config/dbConnection.js";
config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectionToDb();
  console.log(`Server is running on port ${PORT}`);
});
