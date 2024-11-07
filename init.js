const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
  .then(() => {
    console.log(`connetction successful`);
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

let allChats = [
  {
    from: "Waseem",
    to: "Waqar",
    msg: "How are you",
    created_at: new Date(),
  },
  {
    from: "Sami",
    to: "hamza",
    msg: "What's up",
    created_at: new Date(),
  },
  {
    from: "Sana",
    to: "Huma",
    msg: "Good Morning",
    created_at: new Date(),
  },
  {
    from: "Asma",
    to: "Shafaq",
    msg: "Hello, Have a nice day!",
    created_at: new Date(),
  },
];
Chat.insertMany(allChats);
