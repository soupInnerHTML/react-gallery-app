import React from "react";
import { colorList } from "../../global/styles";
import user from "../../store/user";
import cs from "classnames"
import { observer } from "mobx-react-lite";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, message, Skeleton } from "antd";
import firebase from "../../global/firebase";

const CustomAvatar = ({ size, currentTab, isAvatarEditVisible, ...props }) => {

    const { photoURL, } = user.current || {}
    const [isFileLoading, setFileLoading] = React.useState(false)

    let selectAvatar = async e => {
        setFileLoading(true)
        let file = e.target.files[0]
        if (file) {
            let ref = firebase.storage(file.name)
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
            {!user.current.outer && <div className={cs(
                "profile-settings__avatar-edit",
                currentTab - 1 ? "fadeIn" : "fadeOut",
                { "d-none": !isAvatarEditVisible, }
            )}>
                <input onChange={ selectAvatar } type="file"/>
                <Button icon={<EditOutlined />} shape={"circle"} loading={isFileLoading}/>
            </div>}

            <Avatar
                className="header__avatar"
                style={{ backgroundColor: colorList.includes(photoURL) ? photoURL || "rgba(0,0,0,0)" : "rgba(0,0,0,0)", zIndex: 2, }}
                icon={colorList.includes(photoURL) ? <UserOutlined /> : <></>}
                src={photoURL}
                {...{ size, }}
            />

            {!photoURL && <Skeleton avatar active className={"avatar__placeholder" + (size ? size : "")}/>}
        </div>
    )
}


export default observer(CustomAvatar)
