import { runInAction } from "mobx";
import React, { useState } from "react";
import { Col, Form, Input, Row, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { CustomGoogleIcon } from "../Common/CustomGoogleIcon";
import { anonImg, authBtnsIcons, input } from "../../global/styles";
import CustomBtn from "../Common/CustomBtn";
import auth from "../../store/auth";
import AuthModal from "./AuthModal";
import uniqueId from "lodash/uniqueId";

export default observer(() => {
    const { formTemplate, changeSignMode, } = auth

    const [isFetching, setFetching] = useState(false)
    const [gProcessing, setGProcessing] = useState(false)
    const [aProcessing, setAProcessing] = useState(false)

    const authBy = (outer, fetchFn = () => {}, values) => {
        runInAction(() => auth.outer = outer)
        auth.signProcessing(values, fetchFn).then()
    }

    return (
        <AuthModal
            visible={auth.isModalVisible}
            onCancel={() => auth.openModal(false)}
        >
            <Form layout={"vertical"} onFinish={values => authBy(false, setFetching, values)}>

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
                        <Typography.Link
                            onClick={changeSignMode.bind(0, 0)}
                            disabled={gProcessing || isFetching}
                        >
                            {formTemplate.switchText}
                        </Typography.Link>
                    </Form.Item>

                    <Form.Item className={"auth__btns"}>
                        <CustomBtn
                            type="primary"
                            htmlType="submit"
                            loading={isFetching}
                            disabled={gProcessing || aProcessing}
                        >
                            Sign {auth.signMode}
                        </CustomBtn>

                        <CustomBtn
                            icon={<CustomGoogleIcon/>}
                            onClick={() => authBy("google", setGProcessing)}
                            disabled={isFetching || gProcessing || aProcessing}
                        >
                            Sign in with Google
                        </CustomBtn>

                        <CustomBtn
                            onClick={() => {
                                authBy("anon", setAProcessing)
                            }}
                            icon={<img
                                style={authBtnsIcons}
                                src={anonImg}
                            />}
                            loading={aProcessing}
                            disabled={isFetching || gProcessing}
                        >
                            Sign in anonymously
                        </CustomBtn>
                    </Form.Item>

                </div>
            </Form>
        </AuthModal>
    )
})
