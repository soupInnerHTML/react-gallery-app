import { Col, Form, Input, Row, Typography } from "antd"
import { runInAction } from "mobx"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { sign } from "../../global/inputData"
import { input } from "../../global/styles"
import auth from "../../store/auth"
import user from "../../store/user"
import AuthModal from "../Auth/AuthModal"
import CustomBtn from "../Common/CustomBtn"

function ReauthModal() {
    const [isReauthInProgress, setIsReauthInProgress] = useState(false)

    const _changeEmailWithReauth = async ({ password, }) => {
        setIsReauthInProgress(true)
        await user.changeEmailWithReauth(password)
        setIsReauthInProgress(false)
    }
    return (
        <AuthModal visible={auth.isRe} onCancel={() => runInAction(() => auth.isRe = false)}>
            <Typography.Title level={3} style={{ textAlign: "center", }}>Input your password</Typography.Title>
            <Typography.Paragraph style={{ textAlign: "center", }}>To change your email you need to enter your password</Typography.Paragraph>

            <Form layout={"vertical"} onFinish={_changeEmailWithReauth}>
                <Row gutter={10} justify={"center"} wrap={true} align={"bottom"} style={{ margin: 33, }}>
                    <Col span={13}>
                        <Form.Item name="password" rules={sign.up.fields[2].rules} style={{ margin: 0, }}>
                            <Input.Password
                                {...input}
                                placeholder={sign.up.fields[2].placeholder}
                            />
                        </Form.Item>
                    </Col>
                    <Col>
                        <CustomBtn type="primary" htmlType="submit" loading={isReauthInProgress}>Submit</CustomBtn>
                    </Col>
                </Row>
            </Form>
        </AuthModal>
    )
}

export default observer(ReauthModal)
