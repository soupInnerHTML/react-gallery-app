import React from "react";
import { Modal, Tooltip, Typography } from "antd";
import { observer } from "mobx-react-lite/src/observer";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const ProfileSettingsLinkProto = observer((props) => {
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

    return (
        <Typography.Link
            onClick={confirm}
            className={"profile-settings__link"}
            type={"warning"}
            {...props}
        >
            <Tooltip title={`there is ${props.counter.length} items`} placement="right">
                Null your likes
            </Tooltip>
        </Typography.Link>
    );
});

export default ProfileSettingsLinkProto;
