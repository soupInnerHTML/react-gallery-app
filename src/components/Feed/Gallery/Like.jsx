import React, { useState, useEffect } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import cs from "classnames"
import auth from "../../../store/auth";
import likes from "../../../store/likes";

export default observer(({ visible, photo, }) => {
    const [isClicked, setClick] = useState(false)
    const [isRejected, setReject] = useState(false)

    let isLiked = photo.liked

    const like = (flag = true) => {
        setClick(true)
        if (!auth.isLoggedIn) {
            setTimeout(auth.openModal, 500)
            return setReject(true)
        }

        flag ? likes.saveLike(photo) : likes.deleteLike(photo)
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