import { FC, useState } from "react";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import BackendUrlResolver from "../constants/BackendUrlResolver";
import { useTasksContext } from "../context/TasksContext";
import SubTasksOverview from "./SubTasksOverview";
import TaskForm from "./forms/TaskForm";
import { TaskTransformation } from "../helper/TaskTransformationHelper";
import { ITask } from "../types";

interface IProps {
    task: ITask;
}

const URL = BackendUrlResolver.getTasksUrl();

const TaskDetails: FC<IProps> = ({ task }) => {
    const [isDialogOpen, changeVisibility] = useState<boolean>(false);
    const { deleteTask, updateTaskModal, taskModal } = useTasksContext();

    const openEditModal = () => {
        const DetailView = <TaskForm task={task} />;

        updateTaskModal({
            ...taskModal,
            header: `Task ${task.taskTitle} details`,
            isOpen: true,
            component: DetailView,
        });
    };

    return (
        <div>
            <TabView className="tabview-header-icon">
                <TabPanel header="Details" leftIcon="pi pi-file">
                    <div className="card">
                        <div className="flex flex-column align-items-center">
                            <div className="flex-1 h-4rem bg-indigo-500 text-white font-bold text-center p-4 border-round my-2 w-5">
                                <b className="font-bold">Task Title:&nbsp;</b>
                                {task.taskTitle}
                            </div>
                            <div className="flex-1 h-4rem bg-indigo-500 text-white font-bold text-center p-4 border-round my-2 w-5">
                                <b>Priority: &nbsp;</b>
                                {task.priority}
                            </div>
                            <div className="flex-1 h-4rem bg-indigo-500 text-white font-bold text-center p-4 border-round my-2 w-5">
                                <b>Due at: &nbsp;</b>
                                {TaskTransformation.transformDate(
                                    task.dueDay as unknown as string as any
                                )}
                            </div>
                            <div className="flex-1 h-4rem bg-indigo-500 text-white font-bold text-center p-4 border-round my-2 w-5">
                                <b>Pending effort: &nbsp;</b>
                                {task.plannedEffort}
                            </div>
                            <div className="flex-1 h-4rem bg-indigo-500 text-white font-bold text-center p-4 border-round my-2 w-5">
                                <b>Task List: &nbsp;</b>
                                {task.list ? task.list.title : "none"}
                            </div>
                            <div className="flex-1 h-4rem bg-indigo-500 text-white font-bold text-center p-4 border-round my-2 w-5">
                                <b>Task Description: &nbsp;</b>
                                {task.taskDescription}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            label="Edit"
                            icon="pi pi-check"
                            style={{ marginRight: ".25em" }}
                            onClick={openEditModal}
                        />
                        <Button
                            label="Delete"
                            icon="pi pi-times"
                            className="p-button-secondary"
                            onClick={() => deleteTask(task.taskId)}
                        />
                    </div>
                </TabPanel>
                <TabPanel
                    header={`Subtasks (${task.subTaskList.length})`}
                    leftIcon="pi pi-list"
                >
                    <SubTasksOverview
                        subTasks={task.subTaskList}
                        taskId={task.taskId}
                    />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default TaskDetails;
