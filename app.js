import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FROTEND_URL],
    credentials: true,
    // methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/ping", function (req, res) {
  res.send("pong");
});

app.use("/api/v1/user", userRoutes);

app.all("*", function (req, res) {
  res.status(404).send("OOPs! 404 Page Not Found");
});

app.use(errorMiddleware);

export default app;
