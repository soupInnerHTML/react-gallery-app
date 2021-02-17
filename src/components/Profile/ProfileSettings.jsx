import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Button, Col, Collapse, Form, Input, Modal, Row, Typography } from "antd"
import { observer } from "mobx-react-lite";
import auth from "../../store/auth";
import { input } from "../../utils/styles";
import CustomBtn from "../Common/CustomBtn";

export default observer(() => {

    function confirm() {
        Modal.confirm({
            title: "Confirm",
            icon: <ExclamationCircleOutlined/>,
            content: "Are you sure you want to delete your profile?",
            okText: "Submit",
            onOk: auth.deleteProfile,
            cancelText: "Cancel",
        })
    }

    const { Link, } = Typography;

    return (
        <Row justify={"center"} style={{ textAlign: "center", }}>
            <Col span={8}>
                {auth.authState.outer ? <div style={{ marginTop: 40, fontSize: 30, }}><Link onClick={auth.logout} type={"danger"}>Exit</Link></div>
                    :
                    <Collapse expandIcon={() => <></>} ghost className={"profile-settings"} defaultActiveKey={1}>
                        <Collapse.Panel header="Change profile info" key="1" className={"profile-settings__link"}>
                            <Form layout={"vertical"} onFinish={auth.editProfileInfo}>
                                <Form.Item name={"username"} initialValue={auth.authState?.username}>
                                    <Input {...input} placeholder="New user name" />
                                </Form.Item>

                                <Form.Item name={"email"} initialValue={auth.authState?.email} placeholder="New email">
                                    <Input {...input}  placeholder="New email" />
                                </Form.Item>

                                <CustomBtn type="primary" htmlType="submit">Edit</CustomBtn>
                            </Form>
                        </Collapse.Panel>

                        <Collapse.Panel header="Change password" key="2" className={"profile-settings__link"}>
                            <Form layout={"vertical"} onFinish={auth.updatePassword}>
                                <Form.Item
                                    name={"oldPassword"}
                                    initialValue={auth.authState?.username}
                                    rules={[auth.required]}
                                >
                                    <Input.Password {...input} placeholder="Old password" />
                                </Form.Item>

                                <Form.Item
                                    name={"password"}
                                    initialValue={auth.authState?.username}
                                    rules={auth.sign.up.fields[2].rules}
                                >
                                    <Input.Password {...input} placeholder="New password" />
                                </Form.Item>

                                <Form.Item
                                    name={"repeatPassword"}
                                    initialValue={auth.authState?.email}
                                    rules={auth.sign.up.fields[3].rules}
                                    dependencies={auth.sign.up.fields[3].dependencies}
                                >
                                    <Input.Password {...input}  placeholder="Repeat new password" />
                                </Form.Item>

                                <CustomBtn type="primary" htmlType="submit">Update</CustomBtn>
                            </Form>
                        </Collapse.Panel>

                        <Link key="3" onClick={confirm}  className={"profile-settings__danger"}>Delete profile</Link>
                        <Link key="4" onClick={auth.logout}  className={"profile-settings__danger"}>Exit</Link>
                    </Collapse>}
            </Col>
        </Row>
    )
})
