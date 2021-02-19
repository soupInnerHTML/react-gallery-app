import { runInAction } from "mobx";
import React, { useState, useEffect } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import cs from "classnames"
import auth from "../../../store/auth";
import feed from "../../../store/feed";

export default observer(({ visible, isLiked, setLike, photo, id, name, }) => {
    const [isClicked, setClick] = useState(false)
    const [isRejected, setReject] = useState(false)

    const like = (flag = true) => {
        setClick(true)
        if (!auth.authState) {
            setTimeout(auth.openModal, 500)
            return setReject(true)
        }
        setLike(flag)

        flag ? (async () => {
            const { name, } = await auth.saveLike(photo)
            runInAction(() => feed.photos = feed.photos.map(_photo => _photo.id === id ? { ..._photo, name, } : _photo))
            console.log(photo.name)
        })() : auth.deleteLike(photo.name)
    }

    useEffect(() => {
        if (!visible && !isLiked) {
            setClick(false)
        }
    }, [visible, isLiked])

    return (
        <div className={visible || isLiked ? "like" : "d-none"}>
            {
                isLiked ?
                    <HeartFilled
                        className={cs("like__liked", { anim: isClicked, })}
                        onClick={() => like(false)}
                    />
                    :
                    <HeartOutlined
                        className={cs("like__default", { anim: isClicked, rejected: isRejected && isClicked, })}
                        onClick={like}
                    />
            }
        </div>
    )
})