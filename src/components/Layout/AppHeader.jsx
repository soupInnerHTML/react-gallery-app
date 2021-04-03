import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Layout, Menu, Row, Skeleton, Space } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import auth from "../../store/auth";
import routes from "../../global/routes";
import CustomAvatar from "../Common/CustomAvatar";
import CustomBtn from "../Common/CustomBtn";
import { colorList } from "../../global/styles";
import user from "../../store/user";
import isEmpty from "lodash/isEmpty";

const AppHeader = () => {

    const { pathname, } = useLocation()


    const openModalWithMode = mode => {
        auth.changeSignMode(mode)
        auth.openModal()
    }

    return (
        <Layout.Header className="header">
            <Row className="container header-inner">
                <Menu theme="dark" mode="horizontal" selectable={false} >
                    {pathname !== routes.feed && <Menu.Item key="3"><Link to={routes.feed}>Feed</Link></Menu.Item>}
                </Menu>

                <Space align={"center"} size={"large"} className={"fadeIn"}>
                    {auth.isLoggedIn ? pathname !== routes.profile && <Link to={routes.profile}>
                        <Badge dot={!isEmpty(user.current) && !user.current.emailVerified}>
                            <CustomAvatar isAvatarEditVisible={false} />
                        </Badge>
                    </Link> : auth.isModalVisible ? <></> : <>
                        <CustomBtn onClick={() => openModalWithMode("up")}>
                            Sign up
                        </CustomBtn>

                        <CustomBtn type={"primary"} onClick={() => openModalWithMode("in")}>
                            Sign in
                        </CustomBtn>
                    </>}


                </Space>
            </Row>

        </Layout.Header>
    );
};


export default observer(AppHeader)
