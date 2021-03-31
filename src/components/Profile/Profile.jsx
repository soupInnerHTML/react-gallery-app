import React, { useState } from "react";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import { PageHeader, Space, Tabs, Divider, Typography, Breadcrumb, Skeleton } from "antd";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite"
import routes from "../../store/routes";
import user from "../../store/user";
import CustomAvatar from "../Common/CustomAvatar";
import Gallery from "../Feed/Gallery/Gallery";
import ProfileSettings from "./ProfileSettings";
import ReauthModal from "./ReauthModal";

const Profile = () => {
    const [currentTab, setCurrentTab] = useState(1)
    const [activePanel, setActivePanel] = useState(["1"])
    const [isAvatarEditVisible, setAvatarEditVisible] = useState(false)
    const history = useHistory()

    const { TabPane, } = Tabs
    const { Title, Text, } = Typography
    const { displayName, email, outer, } = user.current || {}

    const animSwitch = currentTab == 2 && activePanel.includes("1") ? "backOutDown" : "backInUp"
    const maxAnimSwitch = typeof currentTab == "string" && !outer ? animSwitch : ""


    return (
        <div className={"profile"}>
            <PageHeader
                className="site-page-header pos-a"
                style={{ padding: "0 70px", }}
                onBack={history.goBack}
                subTitle="Назад"
            />


            <Space
                className={"w-100"}
                direction={"vertical"}
                align={"center"}
                style={{ zIndex: 2, }}
            >
                <Breadcrumb className={"profile__breadcrumb"}>
                    <Breadcrumb.Item href={routes.home}>
                        <HomeOutlined />
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <UserOutlined />
                    </Breadcrumb.Item>
                </Breadcrumb>

                <CustomAvatar size={120} {...{ currentTab, isAvatarEditVisible, }}/>

                <Title className={maxAnimSwitch}>
                    {displayName ||
                    <div className="username__placeholder">
                        <Skeleton
                            title={{ width: 100, }}
                            paragraph={{ rows: 0, }}
                            active
                        />
                    </div>}

                </Title>
                <Text type="secondary" className={maxAnimSwitch + "Longer"}>
                    {email ||
                    <div className="email__placeholder">
                        <Skeleton
                            title={{ width: 150, }}
                            paragraph={{ rows: 0, }}
                            active
                        />
                    </div>}
                </Text>
            </Space>

            <Divider />

            <Tabs
                centered
                defaultActiveKey={currentTab}
                onTabClick={setCurrentTab}
                onChange={() => setAvatarEditVisible(true)}
            >

                <TabPane tab="My likes" key="1">
                    <Gallery isLikesSection={true}/>
                </TabPane>

                <TabPane tab="Profile settings" key="2">
                    <ProfileSettings {...{ setActivePanel, }}/>
                </TabPane>
            </Tabs>

            <ReauthModal/>
        </div>
    );
};


export default observer(Profile)
