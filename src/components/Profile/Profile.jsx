import React from "react";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import { PageHeader, Avatar, Space, Tabs, Divider, Typography, Breadcrumb } from "antd";
import { useHistory } from "react-router-dom";
import routes from "../../store/routes";
import Gallery from "../Gallery/Gallery";
import ProfileSettings from "./ProfileSettings";
import { observer } from "mobx-react-lite"
import auth from "../../store/auth"

const Profile = (props) => {
    const { TabPane, } = Tabs;

    const { Title, Text, } = Typography;

    const history = useHistory();

    
    return (
        <div className={"profile"}>
            <PageHeader
                className="site-page-header pos-a"
                onBack={history.goBack}
                // title="Profile"
                subTitle="Назад"
            />


            <Space className={"w-100"} direction={"vertical"} align={"center"}>
                <Breadcrumb className={"profile__breadcrumb"}>
                    <Breadcrumb.Item href={routes.home}>
                        <HomeOutlined />
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <UserOutlined />
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Avatar size={120} style={{ backgroundColor: "#87d068", }} src={auth.authState?.avatar} icon={<UserOutlined />} />

                <Title>{auth.authState?.username}</Title>
                <Text type="secondary">{auth.authState?.email}</Text>
            </Space>

            <Divider />

            <Tabs defaultActiveKey="2" centered>

                <TabPane tab="Your likes" key="1">
                    <Gallery mode={"liked"}/>
                </TabPane>

                <TabPane tab="Profile settings" key="2">
                    <ProfileSettings/>
                </TabPane>
            </Tabs>
        </div>
    );
};


export default observer(Profile)


//TODO функция создания аватара из картинки в ленте
