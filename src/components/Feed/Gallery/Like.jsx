import React, { useState } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import cs from "classnames"
import _firebase from "../../../global/firebase";
import auth from "../../../store/auth";
import likes from "../../../store/likes";
import user from "../../../store/user";

export default observer(({ photo, ...props }) => {
    const [isClicked, setClick] = useState(false)

    let isLiked = photo.liked

    const like = (flag = true) => {
        setClick(true)
        if (!auth.isLoggedIn) {
            return setTimeout(auth.openModal, 500)
        }

        flag ? likes.saveLike(photo) : likes.deleteLike(photo)
    }

    return (
        <div className={ (props.isHovered || isLiked) ? ( (props.visible || isClicked || isLiked) ? "fadeIn_" : "fadeOut_") : ("d-none")}>
            {
                isLiked ?
                    <HeartFilled
                        className={cs("like__liked", { anim: isClicked, })}
                        onClick={() => like(false)}
                    />
                    :
                    <HeartOutlined
                        className={cs("like__default", { anim: isClicked, })}
                        onAnimationEnd={() =>  setClick(false)}
                        onClick={like}
                    />
            }
        </div>
    )
})
