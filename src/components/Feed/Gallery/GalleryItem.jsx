import React, { useState } from "react";
import blackList from "../../../store/blackList";
import feed from "../../../store/feed";
import { Image, Skeleton, Space, Modal, Tooltip } from "antd";
import { CloseOutlined, DownloadOutlined, ExclamationCircleOutlined, RadiusSettingOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import Like from "./Like";
import cs from "classnames"
import user from "../../../store/user"
import auth from "../../../store/auth";

export default observer(({ photo, mode, }) => {

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isSlided, setIsSlided] = useState(false)
    const [isError, setError] = useState(false)
    const [isHover, setHover] = useState(false)

    const fixedScales = {
        // width: feed.IMG_WIDTH,
        // height: feed.IMG_HEIGHT,
        // width: 500,
        height: photo.height || photo.url.match(/\d+/g)[1],
        ...(isCollapsed ? { animation: "collapse 1s forwards", } : {}),
        ...(isSlided && mode ? { animation: "unslide 1s forwards", } : {}),
    }


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
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            // onAnimationEnd={(anim) => isCollapsed && blackList.addPhoto(photo)}
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

                <Tooltip title={"ignore this photo"} onClick={() => setIsCollapsed(true)}>
                    <CloseOutlined
                        className={isHover ? "fadeIn_" : "fadeOut_"}
                    />
                </Tooltip>

                {!user.current.outer && <Tooltip title={"make an avatar"} onClick={confirm}>
                    <RadiusSettingOutlined
                        className={isHover ? "fadeIn_" : "fadeOut_"}
                    />
                </Tooltip>}

                <a href={photo.url} target={"_blank"}>
                    <DownloadOutlined
                        className={isHover ? "fadeIn_" : "fadeOut_"}
                    />
                </a>

                <Like visible={isHover} onClick={() => setIsSlided(true)} {...{ photo, mode, }} />
            </Space>


        </div>
    )
})
