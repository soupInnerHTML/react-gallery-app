import "antd/dist/antd.css";
import "./scss/index.scss"
import React, { useEffect } from "react"
import App from "./components/Layout/App";
import { BrowserRouter } from "react-router-dom"
import auth from "./store/auth";
import feed from "./store/feed";


export default () => {

    useEffect(() => {
        auth.check()
        feed.getList().then(() => {
            console.log("fetched photos on start")
        })
    }, [])

    return (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    )
}