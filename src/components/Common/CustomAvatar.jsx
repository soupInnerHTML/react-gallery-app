import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Skeleton } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import firebase from "firebase";
import auth from "../../store/auth";
import cs from "classnames"

const CustomAvatar = ({ size, currentTab, isAvatarEditVisible, }) => {

    const { avatar, color, } = auth.authState || {}
    const [isFileLoading, setFileLoading] = React.useState(false)

    let selectAvatar = async e => {
        setFileLoading(true)
        let file = e.target.files[0]
        if (file) {
            let ref = firebase.storage().ref("images/" + file.name)
            let snapshot = await ref.put(file,  {
                contentType: file.type,
            })
            let avatar = await snapshot.ref.getDownloadURL()
            await auth.editProfileInfo({ avatar, }, "Avatar successfully update")
        }
        setFileLoading(false)
    }

    return (
        <div style={{ position: "relative", }}>
            <div className={cs(
                "profile-settings__avatar-edit",
                currentTab - 1 ? "fadeIn" : "fadeOut",
                { "d-none": !isAvatarEditVisible, }
            )}>
                <input onChange={ selectAvatar } type="file"/>
                <Button icon={<EditOutlined />} shape={"circle"} loading={isFileLoading}/>
            </div>

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
