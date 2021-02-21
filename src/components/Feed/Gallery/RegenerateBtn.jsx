import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { runInAction } from "mobx";
import React from "react";
import feed from "../../../store/feed";
import cs from "classnames"

const RegenerateBtn = () => {
    const [replaced, setReplaced] = React.useState(false)
    const [isRegeneratingPhotos, setRegeneratingPhotos] = React.useState(false)

    React.useEffect(() => {
        window.addEventListener("scroll", () => {
            //if page offset >= 400 set true | else false
            setReplaced(window.pageYOffset >= 400)
        })
    }, [])

    return (
        <Button
            className={cs("gallery__regenerate", { replaced, })}
            shape={"circle"}
            icon={<ReloadOutlined spin={isRegeneratingPhotos} />}
            onClick={() => {
                setRegeneratingPhotos(true)
                runInAction(() => feed.photos = [])
                feed.addPhotos()
                setTimeout(() => setRegeneratingPhotos(false), 1100)
            }}
        />
    );
};

export default RegenerateBtn;