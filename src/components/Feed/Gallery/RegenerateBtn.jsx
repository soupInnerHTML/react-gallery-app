import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import feed from "../../../store/feed";
import cs from "classnames"
import scrollTo from "../../../utils/scrollTo"

const RegenerateBtn = () => {
    const [replaced, setReplaced] = useState(false)
    const [isRegeneratingPhotos, setRegeneratingPhotos] = useState(false)

    useEffect(() => {
        function shift() {
            setReplaced(window.pageYOffset >= 400)
        }

        window.addEventListener("scroll", shift)

        return () => window.removeEventListener("scroll", shift)
    }, [])

    return (
        <Button
            className={cs("gallery__controlBtn gallery__regenerate", { replaced, })}
            shape={"circle"}
            icon={<ReloadOutlined spin={isRegeneratingPhotos} />}
            onClick={() => {
                scrollTo(0)
                setRegeneratingPhotos(true)
                runInAction(() => feed.photos = [])
                feed.addPhotos()
                setTimeout(() => setRegeneratingPhotos(false), 1100)
            }}
        />
    );
};

export default observer(RegenerateBtn)
