import React, { useEffect } from "react";
import feed from "../store/feed";
import { observer } from "mobx-react-lite";
import Gallery from "./Gallery/Gallery"

export default observer((props) => {


    useEffect(() => {
        const event = ["scroll", feed.lazyLoad]
        window.addEventListener(...event)

        return () => {
            window.removeEventListener(...event)
            console.log("event was removed")
        }
    }, [])

    return (
        <Gallery />
    )
})

