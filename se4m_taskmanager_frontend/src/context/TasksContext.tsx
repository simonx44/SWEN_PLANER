/* eslint-disable react/function-component-definition */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useSelector } from "react-redux";
import {
    ICreateSubTaskDTO,
    ICreateTaskDTO,
    ISubTask,
    ITask,
    ITaskFilter,
    Priority,
    TaskStatus,
} from "../types";
import { TASKSERVICE_INSTANCE } from "../services/taskService";
import { ToastType, useGlobalToasts } from "./ToastContext";
import { RootState } from "../redux/store";
import Messages from "../constants/Messages";
import { TaskTransformation } from "../helper/TaskTransformationHelper";

type ITasksContext = {
    isLoading: boolean;
    tasks: Array<ITask>;
    taskModal: ITaskModal;
    filter?: ITaskFilter;
    createTask: (task: ICreateTaskDTO) => void;
    modifyTask: (taskId: string, task: ITask) => void;
    deleteTask: (taskId: string) => void;
    deleteSubTask: (taskId: string, subTaskId: string) => void;
    updateTaskModal: (settings: ITaskModal) => void;
    closeModal: () => void;
    modifySubTask: (taskId: string, subTask: ISubTask) => void;
    addSubTask: (taskId: string, subTask: ICreateSubTaskDTO) => void;
    getTaskListName: (listId?: string) => string;
};

const TasksContext = React.createContext<ITasksContext>({} as ITasksContext);

interface ITasksState {
    isLoading: boolean;
    data: Array<ITask>;
}

interface ITaskModal {
    isOpen: boolean;
    header: string;
    component?: JSX.Element;
}

export function useTasksContext() {
    return useContext(TasksContext);
}

export function TasksProvider({
    children,
    filter,
}: React.PropsWithChildren<{ filter?: ITaskFilter }>) {
    const [taskModal, updateModal] = useState<ITaskModal>({
        isOpen: false,
        header: "",
    });

    const lists = useSelector((state: RootState) => state.list.lists);

    const { pushMessage } = useGlobalToasts();
    const [httpRequest, updateHttpRequest] = useState<ITasksState>({
        isLoading: false,
        data: [],
    });

    const { isLoading, data } = httpRequest;

    const updateTaskModal = (settings: ITaskModal) => {
        updateModal(settings);
    };

    const closeModal = () => {
        updateModal({ ...taskModal, isOpen: false, component: undefined });
    };

    const getTasks = () => {
        updateHttpRequest((prev) => ({ ...prev, isLoading: true }));
        TASKSERVICE_INSTANCE.getAllTasks(filter)
            .then((tasks) => {
                updateHttpRequest((prev) => ({ ...prev, data: tasks }));
            })
            .catch((e) => {
                pushMessage({ message: e.message, type: ToastType.ERROR });
            })
            .finally(() => {
                updateHttpRequest((prev) => ({ ...prev, isLoading: false }));
            });
    };

    const doesTaskMatchFilter = (date?: Date, listId?: string) => {
        if (!filter) return true;
        if (filter.date && date) {
            const taskDate = TaskTransformation.getFormatDate(date.toString());
            const isValid = new Date(filter.date).getTime() === new Date(taskDate).getTime();
            return isValid;
        }
        if (filter.listId && listId) {
            return filter.listId === listId;
        }
        return false;
    };

    const createTask = (task: ICreateTaskDTO) => {
        closeModal();

        TASKSERVICE_INSTANCE.createTask(task)
            .then((createdTask) => {
                if (doesTaskMatchFilter(task.date, task.listId)) {
                    const newTasks = [...data];
                    const addedTask: ITask = {
                        ...createdTask,
                        priority: task.priority as Priority,
                        list: lists.find((li) => li.listId === task.listId),
                    };
                    newTasks.splice(0, 0, addedTask);
                    updateHttpRequest((prev) => ({ ...prev, data: newTasks }));
                } else {
                    pushMessage({
                        message:
                            Messages.TaskService.TaskSuccessMessages
                                .TASK_CREATED,
                        type: ToastType.SUCCESS,
                    });
                }
            })
            .catch((e) => {
                pushMessage({ message: e.message, type: ToastType.ERROR });
            });
    };

    const modifyTask = (taskId: string, task: ITask) => {
        closeModal();

        const allTasks = [...data];

        console.log("upadrw");

        const index = allTasks.findIndex((el) => el.taskId === taskId);

        if (index === -1) return;

        if (doesTaskMatchFilter(task.dueDay, task.list?.listId)) {
            const previousTask = allTasks[index];

            if (previousTask.state !== task.state) {
                task.subTaskList = task.subTaskList.map((subtask) => ({
                    ...subtask,
                    state: task.state,
                }));
            }
            allTasks[index] = task;
        } else {
            allTasks.splice(index, 1);
        }

        updateHttpRequest((prev) => ({ ...prev, data: allTasks }));

        TASKSERVICE_INSTANCE.modifyTask(taskId, task)
            .then((message) => {
                pushMessage({ message, type: ToastType.SUCCESS });
            })
            .catch((error) => {
                pushMessage({ message: error.message, type: ToastType.ERROR });
            });
    };

    const deleteTask = (taskId: string) => {
        TASKSERVICE_INSTANCE.deleteTask(taskId)
            .then((message) => {
                pushMessage({ message, type: ToastType.SUCCESS });
            })
            .catch((e) => {
                pushMessage({ message: e.message, type: ToastType.ERROR });
            });

        const updatedTasks = [...data];
        const dataTasks = updatedTasks.filter((task) => taskId !== task.taskId);
        updateHttpRequest((prev) => ({ ...prev, data: dataTasks }));
    };

    const findTaskIndex = (taskId: string) => {
        return data.findIndex((task) => task.taskId === taskId);
    };

    const addSubTask = (taskId: string, subTask: ICreateSubTaskDTO) => {
        const index = findTaskIndex(taskId);
        if (index === -1) return;

        TASKSERVICE_INSTANCE.createSubTask(taskId, subTask)
            .then((reponse) => {
                const updatedTasks = [...data];
                updatedTasks[index].subTaskList.push(reponse);
                updateHttpRequest((prev) => ({ ...prev, data: updatedTasks }));
            })
            .catch(() => {
                pushMessage({ message: "To implement", type: ToastType.ERROR });
            });
    };

    const deleteSubTask = (taskId: string, subTaskId: string) => {
        const index = findTaskIndex(taskId);
        if (index === -1) return;

        const updatedTasks = [...data];
        const previousSubtasks = [...updatedTasks[index].subTaskList];
        const updatedSubTasks = previousSubtasks.filter(
            (subTask) => subTask.subtaskId !== subTaskId
        );

        updatedTasks[index].subTaskList = updatedSubTasks;

        updateHttpRequest((prev) => ({ ...prev, data: updatedTasks }));

        TASKSERVICE_INSTANCE.deleteSubTask(taskId, subTaskId).catch(() => {
            updatedTasks[index].subTaskList = previousSubtasks;
            updateHttpRequest((prev) => ({
                ...prev,
                data: [...updatedTasks],
            }));
            pushMessage({
                message: "To implement",
                type: ToastType.ERROR,
            });
        });
    };

    const modifySubTask = async (taskId: string, subTask: ISubTask) => {
        const index = findTaskIndex(taskId);
        if (index === -1) return;

        const updatedTasks = [...data];
        const task: ITask = updatedTasks[index];
        const previousSubtasks = [...task.subTaskList];

        const subTaskIndex = previousSubtasks.findIndex(
            (el) => subTask.subtaskId === el.subtaskId
        );

        if (subTaskIndex === -1) return;

        task.subTaskList.splice(subTaskIndex, 1, subTask);

        const areAllTaskedClosed = task.subTaskList.every(
            (el) => el.state === TaskStatus.CLOSED
        );

        const requests: Array<Promise<any>> = [];

        if (task.state === TaskStatus.OPEN && areAllTaskedClosed) {
            const updatedTask: ITask = { ...task, state: TaskStatus.CLOSED };
            updatedTasks[index] = updatedTask;
            const taskRequest = TASKSERVICE_INSTANCE.modifyTask(
                taskId,
                updatedTask
            );
            requests.push(taskRequest);
        } else {
            updatedTasks[index] = task;
        }

        updateHttpRequest((prev) => ({
            ...prev,
            data: updatedTasks,
        }));

        const subTaskRequest = TASKSERVICE_INSTANCE.modifySubTask(
            taskId,
            subTask
        );
        requests.push(subTaskRequest);
        Promise.all(requests).catch(() => {
            updatedTasks[index].subTaskList = previousSubtasks;
            updateHttpRequest((prev) => ({
                ...prev,
                data: [...updatedTasks],
            }));
            pushMessage({ message: "To implement", type: ToastType.ERROR });
        });
    };

    const getTaskListName = (listId?: string) => {
        if (!listId) return "-";
        const list = lists.find((li) => li.listId === listId);
        return list ? list.title : "-";
    };

    useEffect(() => {
        getTasks();
    }, [filter]);

    const context = useMemo(
        () => ({
            tasks: data,
            taskModal,
            isLoading,
            filter,
            createTask,
            deleteTask,
            modifyTask,
            deleteSubTask,
            updateTaskModal,
            closeModal,
            modifySubTask,
            addSubTask,
            getTaskListName,
        }),
        [data]
    );

    return (
        <TasksContext.Provider value={context}>
            <Dialog
                visible={taskModal.isOpen}
                onHide={() => {
                    updateModal({ ...taskModal, isOpen: false });
                }}
                breakpoints={{ "960px": "75vw", "640px": "100vw" }}
                style={{ width: "50vw" }}
                header={taskModal.header}
                draggable={false}
                resizable={false}
            >
                {taskModal.component ? taskModal.component : <div>Error</div>}
            </Dialog>

            {children}
        </TasksContext.Provider>
    );
}
