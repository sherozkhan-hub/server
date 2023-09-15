require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const socket = require("./socket");
// const errorMiddleware = require("./api/middlewares/error");

// security
// import helmet from "helmet";

mongoose
  .connect(process.env.MONGODB_URL, {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
// app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
// app.use(errorMiddleware);

const { userRouter } = require("./api/routes/users.routes");
app.use("/users", userRouter);

const { postRouter } = require("./api/routes/posts.routes");
app.use("/posts", postRouter);

app.use("/", (req, res) => {
  return res.status(404).json({
    message: "No such route found",
  });
});

const server = app.listen(process.env.PORT, (req, res) => {
  console.log("server is running on" + process.env.PORT);
});

socket.connect(server);
