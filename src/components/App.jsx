import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Avatar, BackTop, Button, Layout, Menu, Row, Space, Typography } from "antd";
import { UserOutlined, UpOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom"
import routes from "../store/routes";
import Routes from "./Routes";
import compose from "../utils/compose";
import Auth from "./Auth";
import auth from "../store/auth";
import feed from "../store/feed";

const App = () => {

    const { Header, Content, Footer, } = Layout;

    const { pathname, } = useLocation()

    let date = new Date()
    let currentYear = date.getFullYear()
    const START_YEAR = 2021
    const authBtnStyle = {
        size: "large",
        shape: "round",
    }

    useEffect(() => {
        auth.stateSync()
        auth.fetchUsers()
        feed.addPhotos()
        console.log("fetched photos on start")
    }, [])

    const openModalWithMode = mode => {
        auth.changeSignMode(mode)
        auth.openModal()
    }

    return (
        <Layout className="layout">
            <Header className="header">
                <Row className="container header-inner">
                    <Menu theme="dark" mode="horizontal">
                        {pathname !== routes.feed && <Menu.Item key="3"><Link to={routes.feed}>Feed</Link></Menu.Item>}
                    </Menu>

                    <Space align={"center"} size={"large"} className={"fadeIn"}>
                        {
                            auth.authState ? <Link to={routes.profile}>
                                {pathname !== routes.profile && <Avatar className="header__avatar" style={{ backgroundColor: "#87d068", }} icon={<UserOutlined />}  src={auth.authState?.avatar} />}
                            </Link>
                                :
                                auth.isModalVisible ? <></> : <><Button type="default" shape={authBtnStyle.shape} size={authBtnStyle.size} onClick={() => openModalWithMode("up")}>
                                        Sign up
                                </Button>

                                <Button type="primary" shape={authBtnStyle.shape} size={authBtnStyle.size} onClick={() => openModalWithMode("in")}>
                                        Sign in
                                </Button></>
                        }


                    </Space>
                </Row>

            </Header>

            <Content className="content">
                <div className="container">
                    <Routes/>
                    <Auth/>

                    <BackTop>
                        <Button type="primary" shape="circle" icon={<UpOutlined />} className="back-top"/>
                    </BackTop>
                </div>
            </Content>

            <Footer className={"text-center"}>
                <Typography.Text type="secondary">
                    @ruby {START_YEAR}
                    {currentYear !== START_YEAR && ` — ${currentYear}`}
                </Typography.Text>
            </Footer>
        </Layout>
    )
}

export default compose(observer)(App)