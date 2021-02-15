import Text from "antd/lib/typography/Text";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Typography } from "antd";
import auth from "../store/auth";
import { observer } from "mobx-react-lite";
import { uniqueId } from "lodash";
import { CloseCircleOutlined } from "@ant-design/icons";
import { CustomGoogleIcon } from "./Common/CustomGoogleIcon";

export default observer(() => {
    const [form] = Form.useForm()
    const [isFetching, setFetching] = useState(false)
    const [errors, setErrors] = useState({ email: "test", })
    const { formTemplate, changeSignMode, } = auth

    const gError = () => {
        console.error("some error with gapi")
    }

    //g(oogle)api is global scope var
    const gSignIn = async () => {
        try {
            const GoogleAuth = gapi.auth2.getAuthInstance()
            const user = await GoogleAuth.signIn({
                scope: "profile email",
            })

            const gUserData = {
                email: user.getBasicProfile().getEmail(),
                username: user.getBasicProfile().getName(),
                avatar: user.getBasicProfile().getImageUrl(),
                outer: true,
            }

            auth.login(gUserData)
        }
        catch (e) {
            gError()
            Modal.error({
                title: "Error",
                content: e.error.replace(/_/g, " "),
            })
        }
    }

    useEffect(() => {
        try {
            gapi.load("auth2", async () => {

                await gapi.auth2.init({
                    // eslint-disable-next-line camelcase
                    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                })
                console.log("init OK")
            })
        }
        catch (e) {
            gError()
        }
    }, [])

    //TODO refactor
    const login = async (values) => {
        try {
            setFetching(true)
            await auth.login(values)
            setFetching(false)
        }
        catch (e) {
            setFetching(false)
            Modal.error({
                title: "Error",
                content: e.toString().replace("Error: ", ""),
            })
        }
    }

    const register = async (values) => {
        try {
            setFetching(true)
            await auth.addUser(values)
            setFetching(false)
        }
        catch (e) {
            setFetching(false)
            Modal.error({
                title: "Error",
                content: e.toString().replace("Error: ", ""),
            })
        }
    }

    const authProcessing = values => {
        // console.log(values)
        switch (auth.signMode){
            case "in": return login(values)
            case "up": return register(values)
        }
    }


    return (
        <Modal
            centered
            className={"auth__modal"}
            visible={auth.isModalVisible}
            footer={null}
            closeIcon={<CloseCircleOutlined />}
            onCancel={() => auth.openModal(false)}
            width={1000}
        >
            <Form {...{ form, }} layout={"vertical"} onFinish={authProcessing}>

                <Row gutter={30} justify={"center"} wrap={true}>
                    {
                        formTemplate.fields.map(field => (
                            <Col span={formTemplate.fields.length > 2 ? 11 : 13} key={uniqueId()}>
                                <Text type="danger">{errors[field.label]}</Text>
                                <Form.Item label={field.label} name={field.label.toLowerCase()}>
                                    <Input style={{ borderRadius: 40, }} size={"large"} placeholder={field.placeholder} />
                                </Form.Item>
                            </Col>
                        ))
                    }

                </Row>

                <div className="text-center">
                    <Form.Item>
                        <Typography.Link onClick={changeSignMode.bind(0, 0)}>
                            {formTemplate.switchText}
                        </Typography.Link>
                    </Form.Item>

                    <Form.Item className={"auth__btns"}>
                        <Button size={"large"} shape="round" type="primary" htmlType="submit" loading={isFetching}>Sign {auth.signMode}</Button>
                        <Button size={"large"} shape="round" icon={<CustomGoogleIcon/>} onClick={gSignIn} disabled={isFetching}>Sign in with Google</Button>
                    </Form.Item>

                </div>
            </Form>
        </Modal>
    )
})