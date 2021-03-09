import { Layout, Typography } from "antd";
import React from "react";
import CustomFirebaseIcon from "../Common/CustomFirebaseIcon";

const AppFooter = () => {

    let date = new Date()
    let currentYear = date.getFullYear()
    const START_YEAR = 2021

    const { Text, } = Typography

    return (
        <Layout.Footer className={"text-center"}>
            <Text type="secondary">
                <a href={"https://github.com/soupInnerHTML"} target={"_blank"} rel={"noopener noreferrer"}>@ruby</a> {START_YEAR}
                {currentYear !== START_YEAR && ` — ${currentYear}`}
            </Text>
            <br/>
            <Text type="secondary">
                Images from <a href={"https://picsum.photos/"} target={"_blank"} rel={"noopener noreferrer"}>Picsum</a>
            </Text>
            <br/>
            <Text type="secondary">
                <a style={{ color: "inherit", }} href={"https://firebase.google.com/"} target={"_blank"} rel={"noopener noreferrer"}>
                    Firebased <CustomFirebaseIcon/>
                </a>
            </Text>
        </Layout.Footer>
    );
};


export default AppFooter;
