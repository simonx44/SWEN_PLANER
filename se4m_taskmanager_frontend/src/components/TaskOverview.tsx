import { FC } from "react";
import { Button } from "primereact/button";
import TaskForm from "../components/forms/TaskForm";
import ListForm from "../components/forms/ListForm";
import TaskCard from "../components/TaskCard";
import { useTasksContext } from "../context/TasksContext";
import TaskOverviewSkeleton from "./skeleton/TaskOverviewSkeleton";
import { connector, ListStoreProps } from "../redux/listStore/lists";

const TaskOverview: FC<ListStoreProps> = ({ lists }) => {
    const { tasks, taskModal, isLoading, updateTaskModal, filter } = useTasksContext();

    const openCreateModal = () => {
        const RenderedTaskForm = () => <TaskForm />;
        updateTaskModal({
            ...taskModal,
            header: "Create new task",
            isOpen: true,
            component: <RenderedTaskForm />,
        });
    };

    const openListModifyModal = (listId: string) => {
        const list = lists.find((li) => li.listId === listId);
        const RenderedTaskForm = () => (
            <ListForm
                list={list}
                closeModal={() =>
                    updateTaskModal({ ...taskModal, isOpen: false })
                }
            />
        );
        updateTaskModal({
            ...taskModal,
            header: "Modify list",
            isOpen: true,
            component: <RenderedTaskForm />,
        });
    };

    return (
        <div className="h-full flex flex-column">
            <div className=" align-self-end">
                {filter && filter.listId && (
                    <Button
                        className="p-button-outlined mx-2"
                        label="Modify list"
                        icon="pi pi-pencil"
                        onClick={() =>
                            openListModifyModal(filter.listId as string)
                        }
                    />
                )}
                <Button
                    className="p-button-outlined align-self-end"
                    label="Add new task"
                    icon="pi pi-plus"
                    onClick={openCreateModal}
                />
            </div>
            {isLoading ? (
                <TaskOverviewSkeleton />
            ) : (
                <div className="grid mt-2">
                    {tasks && tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div
                                className="col-12 md:col-6 xl:col-4 flex flex-column"
                                key={task.taskId}
                            >
                                <TaskCard task={task} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 h-full flex flex-column justify-content-center align-items-center">
                            <h3>No Task found</h3>
                            <div>
                                <Button
                                    className="p-button-outlined"
                                    label="Add new task"
                                    onClick={openCreateModal}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default connector(TaskOverview);
