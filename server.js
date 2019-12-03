const io = require("socket.io")();

io.on("connection", client => {
  client.on("subscribeToTimer", interval => {
    console.log("hello there");
    console.log("client is subscribing to timer with interval ", interval);
    setInterval(() => {
      client.emit("timer", new Date());
    }, interval);
  });
  io.listen(port);
  console.log("listening on port 8k");
});

const port = 8000;
io.listen(port);
console.log("listening on port ", port);
