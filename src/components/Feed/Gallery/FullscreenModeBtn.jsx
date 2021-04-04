import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import feed from "../../../store/feed";
import cs from "classnames"

const FullscreenModeBtn = () => {
    //TODO refactor & anim
    const [replaced, setReplaced] = useState(false)
    useEffect(() => {
        function shift() {
            setReplaced(window.pageYOffset >= 400)
        }

        window.addEventListener("scroll", shift)

        return () => window.removeEventListener("scroll", shift)
    }, [])
    return (
        <Button
            className={cs("gallery__controlBtn gallery__fullscreen", { replaced, } )}
            shape={"circle"}
            icon={feed.isFullScreenMode ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={() => {
                feed.isFullScreenMode ? document.exitFullscreen() : document.documentElement.requestFullscreen()
                runInAction(() => feed.isFullScreenMode = !feed.isFullScreenMode)
            }}
        />
    );
};

export default observer(FullscreenModeBtn)
