import "antd/dist/antd.css";
import "./scss/index.scss"
import React from "react"
import App from "./components/App";
import { BrowserRouter } from "react-router-dom"

export default () => {
    return (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    )
}