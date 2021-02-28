import { runInAction } from "mobx";
import React, { useState } from "react";
import { Col, Form, Input, Modal, Row, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { uniqueId } from "lodash";
import { CloseCircleOutlined } from "@ant-design/icons";
import { CustomGoogleIcon } from "../Common/CustomGoogleIcon";
import { input } from "../../global/styles";
import CustomBtn from "../Common/CustomBtn";
import auth from "../../store/auth";

export default observer(() => {
    const { formTemplate, changeSignMode, } = auth

    const [isFetching, setFetching] = useState(false)
    const [gProcessing, setGProcessing] = useState(false)

    const authBy = (outer, fetchFn, values) => {
        runInAction(() => auth.outer = outer)
        auth.signProcessing(values, fetchFn).then()
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
                            disabled={gProcessing}
                        >
                            Sign {auth.signMode}
                        </CustomBtn>

                        <CustomBtn
                            icon={<CustomGoogleIcon/>}
                            onClick={() => authBy("google", setGProcessing)}
                            disabled={isFetching || gProcessing}
                        >
                            Sign in with Google
                        </CustomBtn>
                    </Form.Item>

                </div>
            </Form>
        </Modal>
    )
})