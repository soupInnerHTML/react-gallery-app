import { Space } from "antd";
import Text from "antd/lib/typography/Text";
import React from "react";
import auth from "../../store/auth";

const CustomPlaceholder = ({ label, errors, }) => {
    return (
        <Space size={5}>
            <Text>{label}</Text>
            {auth.signMode === "up" && <Text type="danger">{errors[label]}</Text>}
        </Space>
    )
}

export default CustomPlaceholder;
