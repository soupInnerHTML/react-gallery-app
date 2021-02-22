import "antd/dist/antd.css";
import "./scss/index.scss"
import React, { useEffect } from "react"
import App from "./components/Layout/App";
import { BrowserRouter } from "react-router-dom"
import auth from "./store/auth";
import blackList from "./store/blackList";
import feed from "./store/feed";
import likes from "./store/likes";


export default () => {

    useEffect(() => {
        auth.check()
        feed.getList().then()
        likes.set(localStorage.getItem("auth")).then()
        blackList.set(localStorage.getItem("auth")).then()
        console.log("fetched photos on start")
    }, [])

    return (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    )
}