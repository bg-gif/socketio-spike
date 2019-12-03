import "./App.css";
import React, { Component } from "react";
import openSocket from "socket.io-client";
const socket = openSocket("localhost:8000");

class App extends Component {
  state = {
    messages: [],
    message: "",
    username: "",
    avatar: "",
    collection: ""
  };

  componentDidUpdate(prevProps, prevState) {
    const { collection } = this.state;
    if (prevState.collection !== collection)
      socket.emit("collection", { collection });
    socket.on("thestorysofar", messages => {
      return this.setState({ messages });
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { message, username, avatar } = this.state;
    socket.removeAllListeners();
    const send = JSON.stringify({ username, message, avatar });
    console.log(send);
    socket.emit("chat message", send);

    socket.on("chat message", returnedMessage => {
      this.setState(currentState => {
        const { messages } = currentState;
        const parsedReturnedMessage = JSON.parse(returnedMessage);
        return {
          message: "",
          messages: [...messages, parsedReturnedMessage]
        };
      });
    });
  };

  handleChange = event => {
    this.setState({ message: event.target.value });
  };
  render() {
    const { messages, username, avatar, collection } = this.state;
    if (!collection) {
      const collection = prompt("Which chat room do you want to connect to?");
      this.setState({ collection });
    }
    if (!username) {
      const username = prompt("Please enter your username");
      this.setState({ username });
    }
    if (!avatar) {
      const avatar = prompt("Please set an address for your avatar");
      this.setState({ avatar });
    }
    return (
      <div>
        <ul id="messages">
          {messages.map(message => {
            const msg = message.message;
            const username = message.username;
            const avatar = message.avatar;
            return (
              <li key={Math.random()}>
                <img className="avatar" src={avatar} alt="" />
                {`${username}: ${msg}`}
              </li>
            );
          })}
        </ul>
        <form action="" onSubmit={this.handleSubmit}>
          <input
            id="m"
            autoComplete="off"
            value={this.state.message}
            onChange={this.handleChange}
          />
          <button>Send</button>
        </form>
      </div>
    );
  }
}

export default App;
