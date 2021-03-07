import { runInAction } from "mobx";
import React, { useEffect } from "react";
import feed from "../../store/feed";
import { observer } from "mobx-react-lite";
import Gallery from "./Gallery/Gallery"

export default observer((props) => {


    useEffect(() => {
        feed.addPhotos()
        const event = ["scroll", feed.lazyLoad]
        window.addEventListener(...event)

        //on unmount
        return () => {
            //bug precaution
            window.removeEventListener(...event)
            console.log("event was removed")
            //performance optimization
            runInAction(() => {
                feed.cachedPhotos = feed.photos
                feed.photos = []
                feed.portion = 0
            })
        }
    }, [])

    return (
        <Gallery />
    )
})
