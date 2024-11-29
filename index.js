const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log(`connection successful`);
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

// let chat1 = new Chat({
//   from: "zohiab",
//   to: "Saqib",
//   msg: "Asslam o Alaikum",
//   created_at: new Date(),
// });

// chat1
//   .save()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Delete Route

app.delete(
  "/chats/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
  })
);

app.post(
  "/chats/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      id,
      { msg: newMsg },
      { runValidators: true, new: true }
    );
    res.redirect("/chats");
  })
);

// New Routs

app.get("/chats/new", (req, res) => {
  // throw new ExpressError(404, "Page not found");
  res.render("new.ejs");
});

function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

// show routes

app.get(
  "/chats/:id",
  asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
      next(new ExpressError(404, "Chat not found"));
    }
    res.render("edit.ejs", { chat });
  })
);

// Edit Routes

app.get(
  "/chats/:id/edit",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  })
);

app.post(
  "/chats",
  asyncWrap(async (req, res, next) => {
    let { from, msg, to } = req.body;
    let newChat = new Chat({
      from: from,
      msg: msg,
      to: to,
      created_at: new Date(),
    });
    await newChat.save();
    res.redirect("/chats");
  })
);

// All Chats Routes

app.get(
  "/chats",
  asyncWrap(async (req, res) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
  })
);

app.get("/", (req, res) => {
  res.send(`root is working`);
});

const handlevalidationError = (err) => {
  console.log("This is a validation Error, Please follow rules ");
  console.dir(err.message);
  return err;
};

// Mongoose Errors handling and Middleware

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === "ValidationError") {
    handlevalidationError(err);
  }
  next(err);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "some error occurred" } = err;
  res.status(status).send(message);
});

app.listen(8080, () => {
  console.log(`app is listening on port: 8080`);
});
