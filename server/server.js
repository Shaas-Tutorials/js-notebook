// importing packages
import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// response function
import response from "./utils/response";

// routes
import userRoute from "./routes/user.route";

// connecting to database
import "./database";

// passport local strategy
import "./local.passport";

dotenv.config();

// init app
const app = express();

// setting port
const port = process.env.PORT || 5000;

// let users = [
//   {
//     firstname: "Admin",
//     lastname: "Admin",
//     email: "admin@gmail.com",
//     password: "aA@1",
//     otp: "1234",
//   },
// ];

// middleware
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "../src/client/build")));

// routes
app.use("/api/users", userRoute);

// 404 error handling
app.use("/api/*", (req, res, next) => {
  const err = new Error("Path not found");
  next(err);
});

// react routes
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../src/client/build", "index.html"));
});

// global error handler
app.use((err, req, res, next) => {
  if (err.message === "Path not found")
    return response(res, null, "Path not found", true, 404);

  response(res, null, "Internal error. Sorry!!!", true, 500);
});

app.listen(port);
