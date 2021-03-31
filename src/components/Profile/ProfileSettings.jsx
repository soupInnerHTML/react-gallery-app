import { ExclamationCircleOutlined } from "@ant-design/icons";
import React from "react";
import { Col, Collapse, Modal, Row, Tooltip, Typography } from "antd"
import { observer } from "mobx-react-lite";
import auth from "../../store/auth";
import user from "../../store/user";
import ProfileEditForm from "./ProfileEditForm";
import likes from "../../store/likes";
import blackList from "../../store/blackList";

export default observer(({ setActivePanel, }) => {

    function confirm(toDo, onOk) {
        return () => Modal.confirm({
            title: "Confirm",
            icon: <ExclamationCircleOutlined/>,
            content: `Are you sure you want to ${toDo}?`,
            okText: "Submit",
            onOk,
            cancelText: "Cancel",
        })
    }


    const { Link, } = Typography

    return (
        <>
            <Row justify={"center"} style={{ textAlign: "center", }}>
                <Col span={8}>
                    <Collapse
                        ghost
                        className={"profile-settings"}
                        defaultActiveKey={1}
                        onChange={setActivePanel}
                    >
                        {
                            !user.current.outer &&
                                <>
                                    <Collapse.Panel
                                        showArrow={false}
                                        header="Change profile info"
                                        key="1"
                                        className={"profile-settings__link"}
                                    >
                                        <ProfileEditForm mode={"data"} />
                                    </Collapse.Panel>

                                    <Collapse.Panel
                                        showArrow={false}
                                        header="Change password"
                                        key="2"
                                        className={"profile-settings__link"}
                                    >
                                        <ProfileEditForm mode={"password"} />
                                    </Collapse.Panel>
                                </>
                        }


                    </Collapse>


                    <Link
                        key="3"
                        onClick={confirm("null your likes", () => user.clear("likes"))}
                        className={"profile-settings__link"}
                        type="warning"
                        disabled={!likes.get().length}
                    >
                        <Tooltip title={` ${likes.get().length} ❤`} placement="right">
                            Null my likes
                        </Tooltip>
                    </Link>


                    <Link
                        key="4"
                        onClick={confirm("null black list", () => user.clear("blackLists"))}
                        className={"profile-settings__link"}
                        type="warning"
                        disabled={!blackList.get().length}
                    >
                        <Tooltip title={` ${blackList.get().length} 💩`} placement="right">
                            Null my black list
                        </Tooltip>
                    </Link>


                    {
                        !user.current.outer &&
                        <Link
                            key="5"
                            onClick={confirm("delete your account", user.delete)}
                            className={"profile-settings__link"}
                            type="danger"
                        >
                            Delete profile
                        </Link>
                    }

                    <Link key="6" onClick={auth.logout} className={"profile-settings__link"} type="danger">
                        Exit
                    </Link>


                </Col>
            </Row>

        </>
    )
})
