import "antd/dist/antd.css";
import "./scss/index.scss"
import React from "react"
import App from "./components/Layout/App";
import { BrowserRouter } from "react-router-dom"
import firebase from "firebase/app"
import "firebase/storage"

let firebaseConfig = {
    storageBucket: "gs://react-gallery-app-fe070.appspot.com",
};

firebase.initializeApp(firebaseConfig);

export default () => {
    return (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    )
}