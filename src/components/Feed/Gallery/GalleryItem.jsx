import React, { useState } from "react";
import auth from "../../../store/auth";
import feed from "../../../store/feed";
import { Image, Skeleton, Space, message } from "antd";
import { CloseOutlined, DownloadOutlined, RadiusSettingOutlined } from "@ant-design/icons";
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

    if (isError) {
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
                preview={{
                    src: photo.bigV,
                }}
                placeholder={<Skeleton.Input active={true} className="gallery-item__preloader" />}
                alt=""
            />

            <Space className={"gallery-item__panel"} size={"large"}>

                <a title={"ignore this photo"} onClick={() => auth.addPhotoToBlackList(photo)}>
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

                <Like
                    visible={isHover}
                    isLiked={photo.liked}
                    id={photo.id}
                    setLike={feed.likePhoto.bind(0, photo.id)}
                    {...{ photo, }}
                />
            </Space>


        </div>
    )
})
