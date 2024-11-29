const express = require("express");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  //   console.log(req);
  //   let { query } = req.query;
  //   console.log(query);
  console.log(`I am 1st middleware`);
  //   res.send("I am a middleware");
  next();
});

app.use((req, res, next) => {
  console.log(`I am 2nd middleware`);
  next();
});

// Logger/Utility Middleware
app.use((req, res, next) => {
  req.time = new Date(Date.now()).toString();
  console.log(`Hi, I am logger middleware`);
  console.log(req.hostname, req.method, req.path, req.time);
  next();
});

// Random Middleware
app.use("/random", (req, res, next) => {
  console.log(`Hi! I am for random root`);
  next();
});

// Api Token Middleware

checkToken = (req, res, next) => {
  let { token } = req.query;
  if (token === "giveaccess") {
    next();
  }
  res.send("Access Denied");
};

// Api Root
app.get("/api", checkToken, (req, res) => {
  res.send("Data");
});

// Root Route

app.get("/", (req, res) => {
  console.log("I am root");
  res.send("I am root route");
});

// Random Middleware
app.get("/random", (req, res) => {
  res.send("Hi! I am Random route");
});

// 404 Middleware
app.use((req, res, next) => {
  res.send("Page Not Found");
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
