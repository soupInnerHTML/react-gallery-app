import { UserOutlined } from "@ant-design/icons";
import { Avatar, Layout, Menu, Row, Space } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import auth from "../../store/auth";
import routes from "../../store/routes";
import CustomBtn from "../Common/CustomBtn";

const AppHeader = () => {

    const { pathname, } = useLocation()

    const openModalWithMode = mode => {
        auth.changeSignMode(mode)
        auth.openModal()
    }


    return (
        <Layout.Header className="header">
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
                            auth.isModalVisible ? <></> : <>
                                <CustomBtn onClick={() => openModalWithMode("up")}>
                                    Sign up
                                </CustomBtn>

                                <CustomBtn type={"primary"} onClick={() => openModalWithMode("in")}>
                                    Sign in
                                </CustomBtn>
                            </>
                    }


                </Space>
            </Row>

        </Layout.Header>
    );
};


export default observer(AppHeader)
