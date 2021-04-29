import "./App.css";
import axios from "axios";
import { Component } from "react";

class App extends Component {
  state = {
    test: "",
  };

  componentDidMount() {
    console.log(process.env.REACT_APP_API_URL);
    axios
      .get(`${process.env.REACT_APP_API_URL}`, { withCredentials: true })
      .then((res) => this.setState({ test: res.data.message }))
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>{this.state.test}</div>
        </header>
      </div>
    );
  }
}

export default App;
