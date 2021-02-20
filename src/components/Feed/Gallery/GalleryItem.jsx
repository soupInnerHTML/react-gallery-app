import { runInAction } from "mobx";
import React, { useEffect, useState } from "react";
import auth from "../../../store/auth";
import blackList from "../../../store/blackList";
import feed from "../../../store/feed";
import { Image, Skeleton, Space, message } from "antd";
import { CloseOutlined, DownloadOutlined, RadiusSettingOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import likes from "../../../store/likes";
import Like from "./Like";
import cs from "classnames"

export default observer(({ photo, }) => {

    const fixedScales = {
        width: feed.IMG_WIDTH,
        height: feed.IMG_HEIGHT,
    }

    const [isError, setError] = useState(false)
    const [isHover, setHover] = useState(false)

    if (isError || blackList.get().includes(photo.idApi)) {
        return <></>
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
                fallback={"a"}
                preview={{
                    src: photo.bigV,
                }}
                placeholder={<Skeleton.Input active={true} className="gallery-item__preloader" />}
                alt=""
            />

            <Space className={"gallery-item__panel"} size={"large"}>

                <a title={"ignore this photo"} onClick={() => blackList.addPhoto(photo)}>
                    <CloseOutlined
                        className={cs({ "d-none": !isHover, })}
                    />
                </a>

                {!auth.authState?.outer && <a title={"make an avatar"} onClick={() => auth.editProfileInfo({ avatar: photo.url, })}>
                    <RadiusSettingOutlined className={cs({ "d-none": !isHover, })} />
                </a>}

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
