import "./App.css";
import axios from "axios";
import { Component } from "react";

class App extends Component {
  state = {
    test: "",
  };
  constructor(props) {
    super(props);
    this.test = this.test.bind(this);
  }
  componentDidMount() {
    console.log(process.env.REACT_APP_API_URL);
    axios
      .get(`${process.env.REACT_APP_API_URL}`, { withCredentials: true })
      .then((res) => console.log(res.data.message))
      .catch((err) => console.log(err));
  }
  test() {
    axios
      .get(`${process.env.REACT_APP_API_URL}`, { withCredentials: true })
      .then((res) => console.log(res.data.message))
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.test}>test</button>
          <div>{this.state.test}</div>
        </header>
      </div>
    );
  }
}

export default App;
