import { Form, Input } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { sign, required } from "../../global/inputData";
import user from "../../store/user";
import CustomBtn from "../Common/CustomBtn";
import { input } from "../../global/styles";

const ProfileEditForm = ({ mode, }) => {

    const form = {
        data: {
            fields: [{
                name: "displayName",
                initialValue: user.current.displayName,
                placeholder: "New user name",
                rules: [required],
            },
            {
                name: "email",
                initialValue: user.current.email,
                placeholder: "New email",
                rules: sign.up.fields[0].rules,
            }],
            onFinish: user.editProfileInfo,
            submitText: "Edit",
        },
        password: {
            fields: [{
                name: "oldPassword",
                placeholder: "Old password",
                rules: [required],
            },
            {
                name: "password",
                placeholder: "New password",
                rules: sign.up.fields[2].rules,
            },
            {
                name: "repeatPassword",
                placeholder: "Repeat password",
                rules: sign.up.fields[3].rules,
                dependencies: sign.up.fields[3].dependencies,
            }],
            onFinish: user.updatePassword,
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
