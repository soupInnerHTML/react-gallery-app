import React, { useState } from "react";
import blackList from "../../../store/blackList";
import { Image, Skeleton, Space, Modal, Tooltip } from "antd";
import { CloseOutlined, DownloadOutlined, ExclamationCircleOutlined, RadiusSettingOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import Like from "./Like";
import cs from "classnames"
import user from "../../../store/user"
import auth from "../../../store/auth";
import download from "downloadjs";

export default observer(({ photo, isLikesSection, }) => {

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isError, setError] = useState(false)
    const [isHover, setHover] = useState(false)
    const [isHovered, setHovered] = useState(false)

    const fixedScales = {
        height: photo.height,
        ...(isCollapsed ? { animation: "collapse 1s forwards", } : {}),
    }

    const panelIconClass = isHovered ? (isHover ? "fadeIn_" : "fadeOut_") : ("d-none")

    function confirm() {
        if (!auth.isLoggedIn) {
            return auth.openModal()
        }
        Modal.confirm({
            title: "Confirm",
            icon: <ExclamationCircleOutlined/>,
            content: "Are you sure you want to update your avatar?",
            okText: "Submit",
            onOk: () => user.editProfileInfo({ photoURL: photo.url, }, "The avatar has been successfully updated"),
            cancelText: "Cancel",
        })
    }

    if (isError || blackList.get().includes(photo.idApi)) {
        return <></>
    }

    return (
        <div
            className='gallery-item'
            style={fixedScales}
            onMouseOver={() => {
                setHover(true)
                setHovered(true)
            }}
            onMouseLeave={() => setHover(false)}
            onAnimationEnd={(e) => {
                e.persist()
                if (e.animationName === "collapse") {
                    blackList.addPhoto(photo)
                }
            }}
        >
            <Image
                onError={() => setError(true)}
                src={photo.url}
                preview={{
                    src: photo.bigV,
                }}
                placeholder={<Skeleton.Input active={true} className="gallery-item__preloader" />}
                className={cs({ darker: isHover, })}
                style={{ transition: "filter .8s", }}
                alt=""
            />

            {/*preload*/}
            <img style={{ display: "none", }} src={photo.bigV} alt=""/>

            <Space className={"gallery-item__panel"} size={"large"}>

                <Tooltip title={"ignore this photo"} onClick={() => {
                    setIsCollapsed(true)
                }}>
                    <CloseOutlined
                        className={panelIconClass}
                    />
                </Tooltip>

                {!user.current.outer && <Tooltip title={"make an avatar"} onClick={confirm}>
                    <RadiusSettingOutlined
                        className={panelIconClass}
                    />
                </Tooltip>}

                <DownloadOutlined
                    onClick={() => {
                        download(photo.url)
                    }}
                    className={panelIconClass}
                />

                <Like visible={isHover} {...{ photo, isHovered, }} />
            </Space>


        </div>
    )
})
