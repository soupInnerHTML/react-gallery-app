import React, { useMemo } from "react";
import { Empty, Image, Row, Spin } from "antd";
import { observer } from "mobx-react-lite";
import feed from "../../../store/feed";
import likes from "../../../store/likes";
import GalleryItem from "./GalleryItem";
import RegenerateBtn from "./RegenerateBtn";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import FullscreenModeBtn from "./FullscreenModeBtn";

export default observer(({ isLikesSection, }) => {

    const _photos = isLikesSection ? useMemo(likes.get, [isLikesSection, likes.isLoaded]) : feed.photos

    if (!likes.isLoaded && isLikesSection) {
        return <Row align={"center"}>
            <Spin size="large" />
        </Row>
    }

    if (_photos.length) {
        return (
            <div className="wrapper-gallery">
                {!isLikesSection && <RegenerateBtn/>}
                <FullscreenModeBtn/>
                <Image.PreviewGroup>
                    <ResponsiveMasonry
                        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4, }}
                    >
                        <Masonry>
                            {
                                _photos.map(photo => (
                                    <GalleryItem
                                        key={photo.id}
                                        {...{ photo, }}
                                    />
                                ))
                            }
                        </Masonry>
                    </ResponsiveMasonry>
                </Image.PreviewGroup>
                {/*Для того, чтобы последняя картинка не центрировалась*/}
                <div style={{ height: 0, width: feed.IMG_WIDTH, }} />
            </div>
        )
    }

    return <Empty className={"gallery__empty"} description={"You haven't liked anything yet"}/>

})
