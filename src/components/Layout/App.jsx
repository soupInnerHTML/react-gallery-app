import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { BackTop, Button, Layout } from "antd";
import { UpOutlined } from "@ant-design/icons";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import Routes from "../Routes";
import Auth from "../Auth/Auth";
import auth from "../../store/auth";
import feed from "../../store/feed";

const App = () => {

    useEffect(() => {
        (async() => {
            feed.getList().then()
            auth.serverSync().then()
            console.log("fetched photos on start")
        })()

    }, [])

    return (
        <Layout className="layout">
            <AppHeader/>

            <Layout.Content className="content">
                <div className="container">
                    <Routes/>
                    <Auth/>

                    <BackTop>
                        <Button type="primary" shape="circle" icon={<UpOutlined />} className="back-top"/>
                    </BackTop>
                </div>
            </Layout.Content>

            <AppFooter/>
        </Layout>
    )
}

export default observer(App)