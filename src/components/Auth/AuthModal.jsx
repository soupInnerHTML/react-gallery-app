import { CloseCircleOutlined } from "@ant-design/icons"
import { Modal } from "antd"
import { observer } from "mobx-react-lite"
import React from "react"

function AuthModal(props) {
    return (
        <Modal
            {...props}
            centered
            className={"auth__modal"}
            footer={null}
            closeIcon={<CloseCircleOutlined />}
            width={1000}
        >
            {props.children}
        </Modal>
    )
}

export default observer(AuthModal)