import React from "react";
import auth from "../../store/auth";
import user from "../../store/user";
import cs from "classnames"
import { observer } from "mobx-react-lite";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, message, Skeleton } from "antd";
import firebase from "firebase/app";

const CustomAvatar = ({ size, currentTab, isAvatarEditVisible, }) => {

    const { photoURL, color, } = user.current || {}
    const [isFileLoading, setFileLoading] = React.useState(false)

    let selectAvatar = async e => {
        setFileLoading(true)
        let file = e.target.files[0]
        if (file) {
            let ref = firebase.storage().ref("images/" + file.name)
            let snapshot = await ref.put(file,  {
                contentType: file.type,
            })
            let photoURL = await snapshot.ref.getDownloadURL()
            await user.editProfileInfo({ photoURL, }, "", true)
            setFileLoading(false)
            message.success("The avatar has been successfully updated");
        }
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
                style={{ backgroundColor: photoURL ? "rgba(0,0,0,0)" : color || "rgba(0,0,0,0)", zIndex: 2, }}
                icon={color ? <UserOutlined /> : <></>}
                src={photoURL}
                {...{ size, }}
            />

            <Skeleton avatar active className={"avatar__placeholder" + (size ? size : "")}/>
        </div>
    );
};


export default observer(CustomAvatar)
