import firebase from "firebase/app";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";

let firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    storageBucket: "gs://react-gallery-app-fe070.appspot.com",
};

firebase.initializeApp(firebaseConfig)

ReactDOM.render(<Root />, document.getElementById("root"));
