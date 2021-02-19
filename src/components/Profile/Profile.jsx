import React, { useState, useEffect } from "react";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import { PageHeader, Avatar, Space, Tabs, Divider, Typography, Breadcrumb } from "antd";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite"
import routes from "../../store/routes";
import CustomAvatar from "../Common/CustomAvatar";
import Gallery from "../Feed/Gallery/Gallery";
import ProfileSettings from "./ProfileSettings";
import auth from "../../store/auth"

const Profile = () => {
    const [currentTab, setCurrentTab] = useState(1)
    const { TabPane, } = Tabs;
    const { Title, Text, } = Typography;
    const history = useHistory();

    const { avatar, username, email, outer, } = auth.authState || {}

    const animSwitch = currentTab == 2 ? "backOutDown" : "backInUp"
    const maxAnimSwitch = typeof currentTab == "string" && !outer ? animSwitch : ""

    // useEffect(() => console.log(currentTab), [currentTab])

    
    return (
        <div className={"profile"}>
            <PageHeader
                className="site-page-header pos-a"
                onBack={history.goBack}
                // title="Profile"
                subTitle="Назад"
            />


            <Space className={"w-100"} direction={"vertical"} align={"center"} style={{ zIndex: 2, }}>
                <Breadcrumb className={"profile__breadcrumb"}>
                    <Breadcrumb.Item href={routes.home}>
                        <HomeOutlined />
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <UserOutlined />
                    </Breadcrumb.Item>
                </Breadcrumb>

                {/*<Avatar size={120} style={{ backgroundColor: "#87d068", }} src={avatar} icon={<UserOutlined />} />*/}
                <CustomAvatar size={120}/>

                <Title className={maxAnimSwitch}>
                    {username}
                </Title>
                <Text type="secondary" className={maxAnimSwitch + "Longer"}>
                    {email}
                </Text>
            </Space>

            <Divider />

            <Tabs defaultActiveKey={currentTab} centered onTabClick={setCurrentTab}>

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