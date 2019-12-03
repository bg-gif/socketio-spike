import "./App.css";
import { subscribeToTimer } from "./api";
import React, { Component } from "react";

class App extends Component {
  state = { timestamp: "nowt" };

  constructor(props) {
    super(props);

    subscribeToTimer((err, timestamp) => this.setState({ timestamp }));
  }

  render() {
    return (
      <div>
        <p>This is the timer value: {this.state.timestamp}</p>
      </div>
    );
  }
}

export default App;
