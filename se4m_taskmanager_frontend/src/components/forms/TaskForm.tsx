import { FC, useEffect, useMemo, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import * as Yup from "yup";
import { ICreateTaskDTO, ITask, Priority } from "../../types";
import { TaskTransformation } from "../../helper/TaskTransformationHelper";
import { useTasksContext } from "../../context/TasksContext";
import { connector, ListStoreProps } from "../../redux/listStore/lists";
import { isFormFieldValid, getFormErrorMessage } from "./FormHelper";

const TaskSchema = Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string().required(),
    priority: Yup.string().required(),
    date: Yup.date(),
    plannedEffort: Yup.string().optional(),
});

type IProps =
    | {
          task?: ITask;
      } & ListStoreProps;

const TaskForm: FC<IProps> = ({ task, lists }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [initialState, updateInitialState] = useState<ICreateTaskDTO>({
        title: "",
        description: "",
        priority: Priority.LOW,
        date: new Date(),
        listId: "",
        plannedEffort: "00:30",
    });
    const [isEditMode, updateEditMode] = useState(false);
    const { createTask, modifyTask, filter } = useTasksContext();

    const formik = useFormik({
        initialValues: initialState,
        validate: (data) => {
            const errors: Record<string, string> = {};

            TaskSchema.validateAt("title", data).catch(() => {
                errors.title = "Title should not be empty";
            });

            TaskSchema.validateAt("description", data).catch(() => {
                errors.description = "Description should not be empty";
            });

            TaskSchema.validateAt("priority", data).catch(() => {
                errors.priority = "Priority should not be empty";
            });

            TaskSchema.validateAt("date", data).catch(() => {
                errors.date = "Date should not be empty";
            });

            return errors;
        },
        onSubmit: (data: ICreateTaskDTO) => {
            updateInitialState(data);
            setShowMessage(false);
            formik.resetForm();
            if (isEditMode && task) {
                const newTask = { ...task };
                const { listId } = formik.values;
                newTask.taskTitle = formik.values.title;
                newTask.taskDescription = formik.values.description;
                newTask.priority = formik.values.priority;
                newTask.dueDay = formik.values.date;
                newTask.list = lists.find((li) => li.listId === listId);
                newTask.plannedEffort = TaskTransformation.transformInternalEffortFormatToNumber(
                    formik.values.plannedEffort
                );
                modifyTask(task.taskId, newTask);
            } else {
                createTask(data);
            }
        },
    });

    const applyFilter = () => {
        if (!filter) return;
        if (filter.date) {
            formik.setFieldValue("date", new Date(filter.date));
        }
        if (filter.listId) {
            formik.setFieldValue("listId", filter.listId);
        }
    };

    const initForm = () => {
        if (task) {
            updateEditMode(true);

            const transformedEffort = TaskTransformation.transformEffortToInternalFormat(
                task.plannedEffort
            );

            formik.setFieldValue("title", task.taskTitle);
            formik.setFieldValue("description", task.taskDescription);
            formik.setFieldValue("priority", task.priority);
            formik.setFieldValue("listId", task.list?.listId);
            formik.setFieldValue("date", new Date(task.dueDay));
            formik.setFieldValue("plannedEffort", transformedEffort);
        } else if (filter) {
            applyFilter();
        }
    };

    useEffect(() => {
        initForm();
    }, []);

    const priorityOptions = useMemo(() => {
        return Object.keys(Priority)
            .filter((el) => Number.isNaN(Number(el)))
            .map((el) => ({
                label: el,
                value: Priority[el as keyof typeof Priority],
            }));
    }, []);

    const listLabels = useMemo(() => {
        const options = lists.map((li) => ({
            label: li.title,
            value: li.listId,
        }));
        return [{ label: "No List", value: null }, ...options];
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
                        Task title
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
                        className={classNames({
                            "p-invalid": isFormFieldValid(
                                "description",
                                formik
                            ),
                        })}
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

            <div className="field col-6">
                <span className="p-float-label">
                    <Dropdown
                        id="priority"
                        name="priority"
                        options={priorityOptions}
                        className={classNames({
                            "p-invalid": isFormFieldValid("priority", formik),
                        })}
                        value={formik.values.priority}
                        onChange={formik.handleChange}
                    />
                    <label
                        htmlFor="priority"
                        className={classNames({
                            "p-error": isFormFieldValid("priority", formik),
                        })}
                    >
                        Select priority
                    </label>
                </span>
                {getFormErrorMessage("priority", formik, showMessage)}
            </div>

            <div className="field col-6">
                <span className="p-float-label">
                    <Dropdown
                        id="listId"
                        name="listId"
                        options={listLabels}
                        className={classNames({
                            "p-invalid": isFormFieldValid("listId", formik),
                        })}
                        value={formik.values.listId}
                        onChange={formik.handleChange}
                    />
                    <label
                        htmlFor="listId"
                        className={classNames({
                            "p-error": isFormFieldValid("listId", formik),
                        })}
                    >
                        Select list
                    </label>
                </span>
                {getFormErrorMessage("listId", formik, showMessage)}
            </div>

            <div className="field col-6">
                <span className="p-float-label">
                    <Calendar
                        id="icon"
                        name="date"
                        dateFormat="dd/mm/yy"
                        className={classNames({
                            "p-invalid": isFormFieldValid("date", formik),
                        })}
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        showIcon
                        onMonthChange={() => {}}
                    />
                    <label
                        htmlFor="date"
                        className={classNames({
                            "p-error": isFormFieldValid("date", formik),
                        })}
                    >
                        Select date
                    </label>
                </span>
            </div>

            <div className="field col-6">
                <span className="p-float-label y-2">
                    <InputText
                        id="plannedEffort"
                        name="plannedEffort"
                        className={classNames({
                            "p-invalid": isFormFieldValid(
                                "plannedEffort",
                                formik
                            ),
                        })}
                        type="time"
                        value={formik.values.plannedEffort}
                        onChange={formik.handleChange}
                    />
                    <label
                        htmlFor="plannedEffort"
                        className={classNames({
                            "p-error": isFormFieldValid(
                                "plannedEffort",
                                formik
                            ),
                        })}
                    >
                        Effort in hours
                    </label>
                </span>
            </div>

            <Button
                className="field col-12"
                type="submit"
                label={isEditMode ? "Save changes" : "Create Task"}
                onClick={() => setShowMessage(true)}
            />
        </form>
    );
};

export default connector(TaskForm);
