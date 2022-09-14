import { FC, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import * as Yup from "yup";
import { ICreateSubTaskDTO } from "../../types";
import { isFormFieldValid, getFormErrorMessage } from "./FormHelper";

const subTaskSchema = Yup.object().shape({
    subTaskTitle: Yup.string().required(),
    subTaskDescription: Yup.string().required(),
});

interface IProps {
    onCreate: (subTask: ICreateSubTaskDTO) => void;
    onCancel: () => void;
}

const SubTaskForm: FC<IProps> = ({ onCreate, onCancel }) => {
    const [showMessage, setShowMessage] = useState(false);
    const formik = useFormik({
        initialValues: {
            subTaskTitle: "",
            subTaskDescription: "",
        },
        validate: (data: ICreateSubTaskDTO) => {
            const errors: Record<string, string> = {};

            subTaskSchema.validateAt("subTaskTitle", data).catch(() => {
                errors.subTaskTitle = "Title should not be empty";
            });

            subTaskSchema.validateAt("subTaskDescription", data).catch(() => {
                errors.subTaskDescription = "Description should not be empty";
            });

            return errors;
        },
        onSubmit: (data: ICreateSubTaskDTO) => {
            setShowMessage(false);
            formik.resetForm();
            onCreate(data);
        },
    });

    return (
        <form className="p-fluid grid my-2" onSubmit={formik.handleSubmit}>
            <div className="field col-12">
                <span className="p-float-label y-2">
                    <InputText
                        id="subTaskTitle"
                        name="subTaskTitle"
                        className={classNames({
                            "p-invalid": isFormFieldValid(
                                "subTaskTitle",
                                formik
                            ),
                        })}
                        value={formik.values.subTaskTitle}
                        onChange={formik.handleChange}
                        autoFocus
                    />
                    <label
                        htmlFor="subTaskTitle"
                        className={classNames({
                            "p-error": isFormFieldValid("subTaskTitle", formik),
                        })}
                    >
                        Subtask title
                    </label>
                </span>
                {getFormErrorMessage("subTaskTitle", formik, showMessage)}
            </div>

            <div className="field col-12">
                <span className="p-float-label y-2">
                    <InputTextarea
                        autoResize
                        id="subTaskDescription"
                        name="subTaskDescription"
                        value={formik.values.subTaskDescription}
                        onChange={formik.handleChange}
                    />
                    <label
                        htmlFor="subTaskDescription"
                        className={classNames({
                            "p-error": isFormFieldValid(
                                "subTaskDescription",
                                formik
                            ),
                        })}
                    >
                        Description
                    </label>
                </span>
                {getFormErrorMessage("subTaskDescription", formik, showMessage)}
            </div>

            <Button
                className="field col-12"
                type="submit"
                label="Create subtask"
                onClick={() => setShowMessage(true)}
            />
            <Button
                className="field col-12"
                type="submit"
                label="Cancel"
                onClick={onCancel}
            />
        </form>
    );
};

export default SubTaskForm;
