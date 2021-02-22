import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import feed from "../../../store/feed";
import cs from "classnames"
import scrollTo from "../../../utils/scrollTo"

const RegenerateBtn = () => {
    const [replaced, setReplaced] = React.useState(false)
    const [isRegeneratingPhotos, setRegeneratingPhotos] = React.useState(false)

    React.useEffect(() => {
        // console.log(feed.backTop)
        function shift() {
            setReplaced(window.pageYOffset >= 400)
        }

        window.addEventListener("scroll", shift)

        return () => window.removeEventListener("scroll", shift)
    }, [])

    return (
        <Button
            className={cs("gallery__regenerate", { replaced, })}
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