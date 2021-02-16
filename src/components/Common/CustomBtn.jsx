import { Button } from "antd";
import React from "react";

const CustomBtn = (props) => {
    return (
        <Button size="large" shape="round" {...props}>{props.children}</Button>
    )
}


export default CustomBtn;
