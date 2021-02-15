import React, { useEffect } from "react";
import { Empty, Image } from "antd";
import { observer } from "mobx-react-lite";
import feed from "../../store/feed";
import GalleryItem from "./GalleryItem";
import auth from "../../store/auth"

export default observer(({ mode, }) => {


    const _photos = mode ? auth.authState.liked : feed.photos

    if (_photos?.length) {
        return (
            <div className="wrapper-gallery">
                <Image.PreviewGroup>
                    {
                        _photos.map(photo => (
                            <GalleryItem
                                key={photo.id}
                                {...{ photo, }} />
                        ))
                    }
                </Image.PreviewGroup>
                {/*Для того, чтобы последняя картинка не центрировалась*/}
                <div style={{ height: 0, width: feed.IMG_WIDTH, }} />
            </div>
        )
    }

    return <Empty className={"gallery__empty"} description={"You haven't liked anything yet"}/>

})

//TODO функция скачивания картинок