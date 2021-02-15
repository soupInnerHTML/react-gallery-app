import React, { useState, useEffect } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import cs from "classnames"
import auth from "../../store/auth";

export default observer(({ visible, isLiked, setLike, photo, }) => {
    const [isClicked, setClick] = useState(false)
    const [isRejected, setReject] = useState(false)

    const like = (flag = true) => {
        setClick(true)
        if (!auth.authState) {
            setTimeout(auth.openModal, 500)
            return setReject(true)
        }
        setLike(flag)

        flag ? auth.saveLike(photo) : () => {}
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

// TODO функция добавления фото в черный список