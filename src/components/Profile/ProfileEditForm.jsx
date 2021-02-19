import { Form, Input } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import auth from "../../store/auth";
import styles from "../../store/styles";
import CustomBtn from "../Common/CustomBtn";
import { input } from "../global/styles";

const ProfileEditForm = ({ mode, }) => {

    const form = {
        data: {
            fields: [{
                name: "username",
                initialValue: auth.authState?.username,
                placeholder: "New user name",
            },
            {
                name: "email",
                initialValue: auth.authState?.email,
                placeholder: "New email",
            }],
            onFinish: auth.editProfileInfo,
            submitText: "Edit",
        },
        password: {
            fields: [{
                name: "oldPassword",
                placeholder: "Old password",
                rules: [auth.required],
            },
            {
                name: "password",
                placeholder: "New password",
                rules: auth.sign.up.fields[2].rules,
            },
            {
                name: "repeatPassword",
                placeholder: "New password",
                rules: auth.sign.up.fields[3].rules,
                dependencies: auth.sign.up.fields[3].dependencies,
            }],
            onFinish: auth.updatePassword,
            submitText: "Update",
        },
    }

    const { fields, onFinish, submitText, } = form[mode]

    return (
        <Form layout={"vertical"} {...{ onFinish, }} className={"profile-edit-form"}>
            {fields.map(field => (
                <Form.Item {...field}>
                    {mode === "password" ?
                        <Input.Password {...input} placeholder={field.placeholder} />
                        :
                        <Input {...input} placeholder={field.placeholder} />}
                </Form.Item>
            ))}

            <CustomBtn type="primary" htmlType="submit">{submitText}</CustomBtn>
        </Form>
    );
};

export default observer(ProfileEditForm)
