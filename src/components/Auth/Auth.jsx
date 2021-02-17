import React, { useEffect, useState } from "react";
import { Col, Form, Input, Modal, Row, Typography } from "antd";
import { gAuth, gSignIn } from "../../api/google";
import { observer } from "mobx-react-lite";
import { uniqueId } from "lodash";
import { CloseCircleOutlined } from "@ant-design/icons";
import { input } from "../../utils/styles";
import { CustomGoogleIcon } from "../Common/CustomGoogleIcon";
import CustomBtn from "../Common/CustomBtn";
import CustomPlaceholder from "./CustomPlaceholder";
import auth from "../../store/auth";

export default observer(() => {
    const [isFetching, setFetching] = useState(false)
    const [gProcessing, setGProcessing] = useState(false)
    const { formTemplate, changeSignMode, } = auth


    useEffect(gAuth, [])

    //TODO refactor login & register
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
            <Form layout={"vertical"} onFinish={authProcessing}>

                <Row gutter={30} justify={"center"} wrap={true}>
                    {
                        formTemplate.fields.map(field => {
                            const inputProps = {
                                ...input,
                                placeholder: field.placeholder,
                            }
                            return (
                                <Col span={formTemplate.fields.length > 2 ? 11 : 13} key={uniqueId()}>

                                    <Form.Item
                                    // label={<CustomPlaceholder {...{ errors, }} label={field.label}/>}
                                        name={field.label.toLowerCase()}
                                        {...field}
                                    >
                                        {
                                            /password/gi.test(field.label) ?
                                                <Input.Password {...inputProps}/> :
                                                <Input {...inputProps} />
                                        }
                                    </Form.Item>
                                </Col>
                            )
                        })
                    }

                </Row>

                <div className="text-center">
                    <Form.Item>
                        <Typography.Link onClick={changeSignMode.bind(0, 0)} disabled={gProcessing || isFetching}>
                            {formTemplate.switchText}
                        </Typography.Link>
                    </Form.Item>

                    <Form.Item className={"auth__btns"}>
                        <CustomBtn type="primary" htmlType="submit" loading={isFetching} disabled={gProcessing}>Sign {auth.signMode}</CustomBtn>
                        <CustomBtn icon={<CustomGoogleIcon/>} onClick={gSignIn.bind(0, setGProcessing)} disabled={isFetching || gProcessing}>Sign in with Google</CustomBtn>
                    </Form.Item>

                </div>
            </Form>
        </Modal>
    )
})