import firebase from "./global/firebase";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";

firebase.init()

ReactDOM.render(<Root />, document.getElementById("root"));
