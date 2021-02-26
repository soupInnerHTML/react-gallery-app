import "antd/dist/antd.css";
import "./scss/index.scss"
import React, { useEffect } from "react"
import App from "./components/Layout/App";
import { BrowserRouter } from "react-router-dom"
import auth from "./store/auth";
import blackList from "./store/blackList";
import feed from "./store/feed";
import likes from "./store/likes";
import _firebase from "./global/firebase";
import user from "./store/user";


export default () => {

    useEffect(() => {
        auth.check()
        feed.getList().then()
        blackList.set(localStorage.getItem("auth")).then()
        console.log("fetched photos on start")

        _firebase.db(`likes/${user.current.uid}`)
    }, [])

    return (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    )
}