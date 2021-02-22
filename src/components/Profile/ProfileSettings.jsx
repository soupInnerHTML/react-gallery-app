import { EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import React from "react";
import { Col, Collapse, Modal, Row, Typography } from "antd"
import { observer } from "mobx-react-lite";
import auth from "../../store/auth";
import user from "../../store/user";
import ProfileEditForm from "./ProfileEditForm";

export default observer(() => {

    function confirm() {
        Modal.confirm({
            title: "Confirm",
            icon: <ExclamationCircleOutlined/>,
            content: "Are you sure you want to delete your profile?",
            okText: "Submit",
            onOk: user.delete,
            cancelText: "Cancel",
        })
    }


    const { Link, } = Typography;

    return (
        <>
            <Row justify={"center"} style={{ textAlign: "center", }}>
                <Col span={8}>
                    {user.current.outer ?
                        <div style={{ marginTop: 40, fontSize: 30, }}>
                            <Link onClick={auth.logout} type={"danger"}>Exit</Link>
                        </div>
                        :
                        <Collapse expandIcon={() => <></>} ghost className={"profile-settings"} defaultActiveKey={1}>
                            <Collapse.Panel header="Change profile info" key="1" className={"profile-settings__link"}>
                                <ProfileEditForm mode={"data"} />
                            </Collapse.Panel>

                            <Collapse.Panel header="Change password" key="2" className={"profile-settings__link"}>
                                <ProfileEditForm mode={"password"} />
                            </Collapse.Panel>

                            <Link key="3" onClick={confirm} className={"profile-settings__danger"}>
                            Delete profile
                            </Link>
                            <Link key="4" onClick={auth.logout} className={"profile-settings__danger"}>
                            Exit
                            </Link>

                        </Collapse>}


                </Col>
            </Row>

        </>
    )
})
