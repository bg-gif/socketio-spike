const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => {
    if (err) {
      console.error(err);
      return;
    }
    const db = client.db("chatroom");
    let collection = "";
    io.on("connection", function(socket) {
      console.log("a user connected");
      socket.on("collection", function(room) {
        console.log(room);
        collection = db.collection(`${room.collection}`);
        collection.find().toArray((err, items) => {
          let messages = [];
          if (items.length > 10) {
            const length = items.length;
            messages = items.slice(length - 10, length);
          } else messages = items;
          io.emit("thestorysofar", messages);
        });
      });

      socket.on("chat message", function(msg) {
        console.log(collection.namespace);
        const obj = JSON.parse(msg);
        console.log("connection");
        collection.insertOne(obj, (err, result) => {
          console.log(result.ops);
        });
        io.emit("chat message", msg);
      });
      socket.on("disconnect", function() {
        console.log("user disconnected");
      });
    });
    http.listen(8000, function() {
      console.log("listening on *:8000");
    });
  }
);
