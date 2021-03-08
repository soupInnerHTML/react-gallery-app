import { Layout, Typography } from "antd";
import React from "react";
import CustomFirebaseIcon from "../../assets/icons/firebase.svg";

const AppFooter = () => {

    let date = new Date()
    let currentYear = date.getFullYear()
    const START_YEAR = 2021

    return (
        <Layout.Footer className={"text-center"}>
            <Typography.Text type="secondary">
                <a href={"https://github.com/soupInnerHTML"} target={"_blank"} rel={"noopener noreferrer"}>@ruby</a> {START_YEAR}
                {currentYear !== START_YEAR && ` — ${currentYear}`}
            </Typography.Text>
            <br/>
            <Typography.Text type="secondary">
                Images from <a href={"https://picsum.photos/"} target={"_blank"} rel={"noopener noreferrer"}>Picsum</a>
            </Typography.Text>
            <Typography.Text type="secondary">
                Fire based <CustomFirebaseIcon/>
            </Typography.Text>
        </Layout.Footer>
    );
};


export default AppFooter;
