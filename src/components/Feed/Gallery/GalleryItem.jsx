import React, { useState } from "react";
import auth from "../../../store/auth";
import blackList from "../../../store/blackList";
import feed from "../../../store/feed";
import { Image, Skeleton, Space, Modal, Tooltip } from "antd";
import { CloseOutlined, DownloadOutlined, ExclamationCircleOutlined, RadiusSettingOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import Like from "./Like";
import cs from "classnames"

export default observer(({ photo, }) => {

    const fixedScales = {
        width: feed.IMG_WIDTH,
        height: feed.IMG_HEIGHT,
    }


    const [isError, setError] = useState(false)
    const [isHover, setHover] = useState(false)

    React.useEffect(() => console.log(isHover), [isHover])

    function confirm() {
        Modal.confirm({
            title: "Confirm",
            icon: <ExclamationCircleOutlined/>,
            content: "Are you sure you want to update your avatar?",
            okText: "Submit",
            onOk: () => auth.editProfileInfo({ avatar: photo.url, }),
            cancelText: "Cancel",
        })
    }

    if (isError || blackList.get().includes(photo.idApi)) {
        return <></>
    }

    function uiBanned() {
        setHover(false)
        setHover(true)
        blackList.addPhoto(photo).then()
    }

    return (
        <div
            className='gallery-item'
            style={fixedScales}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Image
                onError={() => setError(true)}
                src={photo.url}
                // preview={{
                //     src: photo.bigV,
                // }}
                placeholder={<Skeleton.Input active={true} className="gallery-item__preloader" />}
                className={cs({ darker: isHover, })}
                style={{ transition: "filter .8s", }}
                alt=""
            />

            <Space className={"gallery-item__panel"} size={"large"}>

                <Tooltip title={"ignore this photo"} onClick={uiBanned}>
                    <CloseOutlined
                        className={cs({ "d-none": !isHover, })}
                    />
                </Tooltip>

                {!auth.authState?.outer && <Tooltip title={"make an avatar"} onClick={confirm}>
                    <RadiusSettingOutlined className={cs({ "d-none": !isHover, })} />
                </Tooltip>}

                <a href={photo.url} target={"_blank"}>
                    <DownloadOutlined
                        className={cs({ "d-none": !isHover, })}
                    />
                </a>

                <Like visible={isHover} {...{ photo, }} />
            </Space>


        </div>
    )
})
