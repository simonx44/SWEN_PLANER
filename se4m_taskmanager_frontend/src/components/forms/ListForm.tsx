import { FC, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import * as Yup from "yup";
import { ICreateListDTO, TaskList } from "../../types/TaskList";
import { TASKLIST_INSTANCE } from "../../services/listService";
import { ToastType, useGlobalToasts } from "../../context/ToastContext";
import { isFormFieldValid, getFormErrorMessage } from "./FormHelper";

const TaskSchema = Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string().required(),
});

interface IProps {
    list?: TaskList;
    closeModal?: () => void;
}

const initalHttpStatus = {
    isLoading: false,
    error: undefined,
};

const TaskForm: FC<IProps> = ({ list, closeModal }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [httpStatus, updateHttpStatus] = useState(initalHttpStatus);
    const [isEditMode, updateEditMode] = useState(false);
    const { pushMessage } = useGlobalToasts();

    const createNewList = (listToCreate: ICreateListDTO) => {
        updateHttpStatus({ isLoading: true, error: undefined });
        TASKLIST_INSTANCE.createList(listToCreate)
            .then(() => {
                if (closeModal) closeModal();
            })
            .catch((error: Error) => {
                pushMessage({ message: error.message, type: ToastType.ERROR });
            })
            .finally(() => {
                updateHttpStatus({ ...httpStatus, isLoading: false });
            });
    };

    const modifyList = (listId: string, listToCreate: ICreateListDTO) => {
        updateHttpStatus({ isLoading: true, error: undefined });
        TASKLIST_INSTANCE.modifyList(listId, listToCreate)
            .then(() => {
                if (closeModal) closeModal();
            })
            .catch((error: Error) => {
                pushMessage({ message: error.message, type: ToastType.ERROR });
            })
            .finally(() => {
                updateHttpStatus({ ...httpStatus, isLoading: false });
            });
    };
    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
        },
        validate: (data) => {
            const errors: Record<string, string> = {};

            TaskSchema.validateAt("title", data).catch(() => {
                errors.title = "Title should not be empty";
            });

            TaskSchema.validateAt("description", data).catch(() => {
                errors.description = "Description should not be empty";
            });

            return errors;
        },
        onSubmit: (data: ICreateListDTO) => {
            setShowMessage(false);
            formik.resetForm();
            if (isEditMode && list) {
                const listToModify: ICreateListDTO = {
                    title: formik.values.title,
                    description: formik.values.description,
                };
                modifyList(list.listId, listToModify);
            } else {
                createNewList(data);
            }
        },
    });

    useEffect(() => {
        if (list) {
            updateEditMode(true);

            formik.setFieldValue("title", list.title);
            formik.setFieldValue("description", list.description);
        }
    }, []);

    return (
        <form className="p-fluid grid my-2" onSubmit={formik.handleSubmit}>
            <div className="field col-12">
                <span className="p-float-label y-2">
                    <InputText
                        id="title"
                        name="title"
                        className={classNames({
                            "p-invalid": isFormFieldValid("title", formik),
                        })}
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        autoFocus
                    />
                    <label
                        htmlFor="title"
                        className={classNames({
                            "p-error": isFormFieldValid("title", formik),
                        })}
                    >
                        List title
                    </label>
                </span>
                {getFormErrorMessage("title", formik, showMessage)}
            </div>

            <div className="field col-12">
                <span className="p-float-label y-2">
                    <InputTextarea
                        autoResize
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                    <label
                        htmlFor="description"
                        className={classNames({
                            "p-error": isFormFieldValid("description", formik),
                        })}
                    >
                        Description
                    </label>
                </span>
                {getFormErrorMessage("description", formik, showMessage)}
            </div>

            <Button
                className="field col-12"
                type="submit"
                label={isEditMode ? "Save changes" : "Create List"}
                onClick={() => setShowMessage(true)}
            />
        </form>
    );
};

export default TaskForm;
