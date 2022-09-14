/* eslint-disable react/jsx-props-no-spreading */
import { FC, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { useClickAway } from "react-use";
import { Checkbox } from "primereact/checkbox";
import { OverlayPanel } from "primereact/overlaypanel";
import { ITask, Priority, TaskStatus } from "../types";
import TaskDetails from "./TaskDetails";
import { TaskTransformation } from "../helper/TaskTransformationHelper";
import { useTasksContext } from "../context/TasksContext";
import TaskForm from "./forms/TaskForm";

interface IProps {
    task: ITask;
}

const TaskCard: FC<IProps> = ({ task }) => {
    const [isToolboxOpen, toggleToolbox] = useState(false);
    const {
        taskModal,
        deleteTask,
        modifyTask,
        updateTaskModal,
        getTaskListName,
    } = useTasksContext();

    const ref = useRef(null);
    useClickAway(ref, () => {
        toggleToolbox(!isToolboxOpen);
    });

    const getBadgeColor = (priority: Priority) => {
        switch (priority) {
            case Priority.LOW:
                return "success";
            case Priority.MEDIUM:
                return "info";
            case Priority.HIGH:
                return "warning";
            case Priority.URGENT:
                return "danger";
            default:
                return "info;";
        }
    };

    const isTaskFinished = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.OPEN:
                return false;
            default:
                return true;
        }
    };

    const updateTaskState = () => {
        const newState: TaskStatus = task.state === TaskStatus.OPEN
            ? TaskStatus.CLOSED
            : TaskStatus.OPEN;

        modifyTask(task.taskId, { ...task, state: newState });
    };

    const openDetailModal = () => {
        const DetailView = <TaskDetails task={task} />;
        updateTaskModal({
            ...taskModal,
            header: `Task ${task.taskTitle} details`,
            isOpen: true,
            component: DetailView,
        });
    };

    const openEditModal = () => {
        const DetailView = <TaskForm task={task} />;

        updateTaskModal({
            ...taskModal,
            header: `Task ${task.taskTitle} details`,
            isOpen: true,
            component: DetailView,
        });
    };

    const getSubtasksDetailsAsText = () => {
        const subTasks = task.subTaskList;
        if (!subTasks || subTasks.length === 0) return "-";

        let closedSubtasks = 0;

        subTasks.forEach((subTask) => {
            if (subTask.state === TaskStatus.CLOSED) closedSubtasks += 1;
        });

        return `${closedSubtasks}/${subTasks.length}`;
    };

    return (
        <Card style={{ marginTop: "1rem" }} className="tp-card">
            <div className="flex justify-content-start align-items-start">
                <span className="text-2xl mr-2">{task.taskTitle}</span>
                <Badge
                    className=""
                    value={Priority[task.priority]}
                    severity={getBadgeColor(task.priority)}
                />

                <div
                    className="tp-card__action"
                    onClick={() => toggleToolbox(!isToolboxOpen)}
                >
                    ...
                </div>

                {isToolboxOpen && (
                    <div ref={ref} className="tp-popover">
                        <div
                            className="tp-popover--action"
                            onClick={openDetailModal}
                        >
                            <span>Detail</span>
                            <i className="pi pi-eye" />
                        </div>
                        <div
                            className="tp-popover--action"
                            onClick={openEditModal}
                        >
                            <span> Edit </span>
                            <i className="pi pi-pencil" />
                        </div>
                        <div
                            className="tp-popover--action"
                            onClick={() => deleteTask(task.taskId)}
                        >
                            <span>Delete</span>
                            <i className="pi pi-trash" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-content-between align-items-center border-top-1 border-300 mt-2 pt-2">
                <div className="flex flex-column">
                    <span className="text-xs">Aufwand (in h):</span>
                    <span>
                        {TaskTransformation.transformEffortToInternalFormat(
                            task.plannedEffort
                        )}
                    </span>
                </div>
                <div className="flex flex-column">
                    <span className="text-xs">Unteraufgaben</span>
                    <span className="text-right">
                        {getSubtasksDetailsAsText()}
                    </span>
                </div>
            </div>
            <div className="flex justify-content-between align-items-center border-top-1 border-300 mt-2 pt-2 grid">
                <div className="col-6 flex flex-column">
                    <span className="text-xs">Enddatum</span>
                    <span>
                        {TaskTransformation.transformDate(
                            task.dueDay.toString()
                        )}
                    </span>
                </div>
                <div className="col-6 flex flex-column text-right">
                    <span className="text-xs">Liste</span>
                    <span>{getTaskListName(task.list?.listId)}</span>
                </div>
            </div>

            <div className="flex justify-content-between align-items-center border-top-1 border-300 mt-2 pt-2 grid">
                <div className="col-10 flex flex-column">
                    <span className="text-xs">Beschreibung:</span>
                    <p className="m-0 flex-1" style={{ lineHeight: "1.5" }}>
                        {task.taskDescription}
                    </p>
                </div>
                <div className="col-2 flex justify-content-end align-items-end h-full">
                    <Checkbox
                        inputId="cb3"
                        value="Los Angeles"
                        checked={isTaskFinished(task.state)}
                        onChange={updateTaskState}
                    />
                </div>
            </div>

            <div className="p-card-footer">
                <span onClick={openDetailModal}> More Details</span>
            </div>
        </Card>
    );
};

export default TaskCard;
