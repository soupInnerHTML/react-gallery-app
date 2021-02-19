import { UserOutlined } from "@ant-design/icons";
import { Avatar, Skeleton } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import auth from "../../store/auth";

const CustomAvatar = ({ size, }) => {

    const { avatar, color, } = auth.authState || {}

    return (
        <div style={{ position: "relative", }}>
            <Avatar
                className="header__avatar"
                style={{ backgroundColor: avatar ? "rgba(0,0,0,0)" : color || "rgba(0,0,0,0)", zIndex: 2, }}
                icon={color ? <UserOutlined /> : <></>}
                src={avatar}
                {...{ size, }}
            />
            <Skeleton avatar active className={"avatar__placeholder" + (size ? size : "")}/>
        </div>
    );
};


export default observer(CustomAvatar)
