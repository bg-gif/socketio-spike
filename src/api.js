import openSocket from "socket.io-client";
const socket = openSocket("localhost:8000");

function handleSubmit(event) {
  event.preventDefault();
  const msg = event.target.m.value;
  console.log(msg);
  socket.emit("chat message", msg);
  socket.on("chat message", function(msg) {
    this.setState(currentState => {
      return { msg, ...currentState.messages };
    });
  });
}

export { handleSubmit };
