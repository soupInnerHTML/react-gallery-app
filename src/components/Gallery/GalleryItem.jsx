import React, { useState } from "react";
import feed from "../../store/feed";
import { Image, Skeleton, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
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
