import { FC, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import * as Yup from "yup";
import { ICreateUserDTO } from "types";
import { AUTHSERVICE_INSTANCE } from "services/authService";
import { ToastType, useGlobalToasts } from "context/ToastContext";
import { isFormFieldValid, getFormErrorMessage } from "../FormHelper";

const LoginSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required(),
    name: Yup.string().required(),
});

const SignUpForm: FC<{}> = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState<ICreateUserDTO>({});
    const [initialState, updateInitialState] = useState<ICreateUserDTO>({
        username: "",
        password: "",
        name: "",
    });
    const { pushMessage } = useGlobalToasts();

    const signUpUser = (data: ICreateUserDTO) => {
        AUTHSERVICE_INSTANCE.signUpUser(data)
            .then((message: string) => {
                pushMessage({ message, type: ToastType.SUCCESS });
            })
            .catch((err) => {
                pushMessage({ message: err.message, type: ToastType.ERROR });
            });
    };

    const formik = useFormik({
        initialValues: initialState,
        validate: (data) => {
            const errors: ICreateUserDTO = {};

            LoginSchema.validateAt("username", data).catch(() => {
                errors.username = "Username should not be empty";
            });

            LoginSchema.validateAt("password", data).catch(() => {
                errors.password = "Password should not be empty";
            });

            LoginSchema.validateAt("name", data).catch(() => {
                errors.name = "Name should not be empty";
            });

            return errors;
        },
        onSubmit: (data: ICreateUserDTO) => {
            setFormData(data);
            setShowMessage(false);
            formik.resetForm();
            signUpUser(data);
        },
    });

    return (
        <form className="p-fluid grid mt-2" onSubmit={formik.handleSubmit}>
            <p className="text-2xl text-center col-12">
                Create a new User and start organizing your tasks
            </p>
            <div className="field col-12">
                <div className="p-float-label y-2 w-full">
                    <InputText
                        id="username"
                        name="username"
                        className={classNames({
                            "p-invalid": isFormFieldValid("username", formik),
                        })}
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        autoFocus
                    />
                    <label
                        htmlFor="username"
                        className={classNames({
                            "p-error": isFormFieldValid("username", formik),
                        })}
                    >
                        username
                    </label>
                </div>
                {getFormErrorMessage("username", formik, showMessage)}
            </div>
            <div className="field col-12">
                <div className="p-float-label y-2 w-full">
                    <InputText
                        id="name"
                        name="name"
                        className={classNames({
                            "p-invalid": isFormFieldValid("name", formik),
                        })}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                    <label
                        htmlFor="name"
                        className={classNames({
                            "p-error": isFormFieldValid("name", formik),
                        })}
                    >
                        name
                    </label>
                </div>
                {getFormErrorMessage("name", formik, showMessage)}
            </div>
            <div className="field col-12">
                <div className="p-float-label y-2 w-full">
                    <Password
                        id="password"
                        name="password"
                        className={classNames({
                            "p-invalid": isFormFieldValid("password", formik),
                        })}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        toggleMask
                    />
                    <label
                        htmlFor="password"
                        className={classNames({
                            "p-error": isFormFieldValid("password", formik),
                        })}
                    >
                        Password
                    </label>
                </div>
                {getFormErrorMessage("password", formik, showMessage)}
            </div>

            <div className="field col-12">
                <Button
                    type="submit"
                    label="Sign Up"
                    onClick={() => setShowMessage(true)}
                />
            </div>
        </form>
    );
};

export default SignUpForm;
