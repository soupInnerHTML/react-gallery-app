export const required = {
    required: true,
    message: "",
}

export const sign = {
    in: {
        fields: [{
            label: "Email",
            placeholder: "example@example.com",
            rules: [
                required
            ],
        },
        {
            label: "Password",
            placeholder: "••••••••",
            rules: [
                required
            ],
        }],
        switchText: "Doesn't have an account? Sign up or",
    },

    up: {
        fields: [{
            label: "Email",
            placeholder: "example@example.com",
            rules: [
                required,
                {
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Email is incorrect",
                }
            ],
        },
        {
            label: "User name",
            placeholder: "Elon Musk",
            rules: [
                required
            ],
        },
        {
            label: "Password",
            placeholder: "••••••••",
            rules: [
                required,
                {
                    min: 8,
                    message: "Minimum password length is 8 chars",
                }
            ],
        },
        {
            label: "Repeat password",
            placeholder: "••••••••",
            dependencies: ["password"],
            rules: [
                required,
                ({ getFieldValue, }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                        }

                        return Promise.reject("The two passwords that you entered do not match!");
                    },
                })
            ],
        }],
        switchText: "Already have an account? Just sign in or",
    },
}