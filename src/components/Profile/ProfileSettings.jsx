import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Button, Col, Input, Modal, Row, Typography } from "antd"
import { observer } from "mobx-react-lite";
import auth from "../../store/auth";

export default observer(() => {

    // const { TextArea, } = Input;

    //auth.deleteProfile
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

    const [isPassChanges, setPassChangesMode] = useState(false)

    return (
        <Row justify={"center"} style={{ textAlign: "center", }}>
            <Col span={8}>
                <Input maxLength={24} />
                <div style={{ margin: "24px 0", }} />

                <Input maxLength={24} />
                <div style={{ margin: "24px 0", }} />

                <Link onClick={() => setPassChangesMode(true)}>Change password</Link>
                <div style={{ margin: "5px 0", }} />
                <Link type="danger" onClick={confirm}>Delete profile</Link>
                <div style={{ margin: "5px 0", }} />
                <Link type="danger" onClick={auth.logout}>Exit</Link>
                <div style={{ margin: "24px 0", }} />

                {isPassChanges && <>
                    <Input.Password maxLength={42} />
                    <div style={{ margin: "24px 0", }} />

                    <Input.Password maxLength={42} />
                    <div style={{ margin: "24px 0", }} />
                </>}

                <Button type="primary" size={"large"}>
                    Submit
                </Button>
            </Col>
        </Row>
    )
})
