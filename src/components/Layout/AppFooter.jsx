import { Layout, Typography } from "antd";
import React from "react";

const AppFooter = () => {

    let date = new Date()
    let currentYear = date.getFullYear()
    const START_YEAR = 2021

    return (
        <Layout.Footer className={"text-center"}>
            <Typography.Text type="secondary">
                @ruby {START_YEAR}
                {currentYear !== START_YEAR && ` — ${currentYear}`}
            </Typography.Text>
        </Layout.Footer>
    );
};


export default AppFooter;
