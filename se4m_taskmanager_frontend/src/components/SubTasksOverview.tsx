/* eslint-disable react/no-unused-prop-types */
import { FC, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { ICreateSubTaskDTO, ISubTask, TaskStatus } from "../types";
import { useTasksContext } from "../context/TasksContext";
import SubTaskForm from "./forms/SubTaskForm";

interface IProps {
    taskId: string;
    subTasks: Array<ISubTask>;
}

const Status = (
    { state, subtaskId }: ISubTask,
    onChange: (id: string) => void
) => {
    return (
        <Checkbox
            checked={state === TaskStatus.CLOSED}
            onChange={() => {
                onChange(subtaskId);
            }}
        />
    );
};

const DeleteColumn = (
    { subtaskId }: ISubTask,
    handleDeleteChange: (id: string) => void
) => {
    return (
        <i
            className="pi pi-trash cursor-pointer"
            onClick={() => handleDeleteChange(subtaskId)}
        />
    );
};

const textEditor = (options: any) => {
    return (
        <InputText
            type="text"
            value={options.value}
            onChange={(e) => options.editorCallback(e.target.value)}
        />
    );
};
const statusEditor = (options: any) => {
    const statuses = [
        { label: "OPEN", value: TaskStatus.OPEN },
        { label: "CLOSED", value: TaskStatus.CLOSED },
    ];

    const currentStatus = options.rowData.state;

    return (
        <Dropdown
            value={currentStatus}
            options={statuses}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Status"
        />
    );
};

const SubTasksOverview: FC<IProps> = ({ subTasks, taskId }) => {
    const { modifySubTask, addSubTask, deleteSubTask, tasks } = useTasksContext();
    const [editingRows, setEditingRows] = useState({});
    const [localSubTasks, updateLocalSubTasks] = useState<Array<ISubTask>>([]);
    const [isCreateMode, toggleCreateMode] = useState<boolean>(false);

    useEffect(() => {
        console.log(subTasks);
        updateLocalSubTasks(subTasks);
    }, [subTasks, tasks]);

    const addNewSubTask = (subTask: ICreateSubTaskDTO) => {
        toggleCreateMode(false);

        addSubTask(taskId, subTask);
    };

    const onRowEditChange = (e: any) => {
        setEditingRows(e.data);
    };

    const onRowEditComplete = (e: any) => {
        const { newData } = e;

        const subTask = newData as ISubTask;
        modifySubTask(taskId, subTask);
    };

    const handleStatusChange = (subtaskId: string) => {
        const index = localSubTasks.findIndex(
            (el) => el.subtaskId === subtaskId
        );
        if (index === -1) return;

        const subTask = { ...localSubTasks[index] };
        subTask.state = subTask.state === TaskStatus.OPEN
            ? TaskStatus.CLOSED
            : TaskStatus.OPEN;
        modifySubTask(taskId, subTask);
    };

    const handleDelete = (subtaskId: string) => {
        const index = localSubTasks.findIndex(
            (el) => el.subtaskId === subtaskId
        );

        if (index < 0) return;

        deleteSubTask(taskId, localSubTasks[index].subtaskId);
    };

    return (
        <div className="flex flex-column">
            {isCreateMode ? (
                <SubTaskForm
                    onCreate={addNewSubTask}
                    onCancel={() => toggleCreateMode(false)}
                />
            ) : (
                <div>
                    {localSubTasks.length > 0 ? (
                        <DataTable
                            value={localSubTasks}
                            editMode="row"
                            dataKey="subtaskId"
                            editingRows={editingRows}
                            onRowEditChange={onRowEditChange}
                            onRowEditComplete={onRowEditComplete}
                            responsiveLayout="scroll"
                        >
                            <Column
                                field="subtaskTitle"
                                header="Title"
                                editor={(options) => textEditor(options)}
                            />
                            <Column
                                field="subtaskDescription"
                                header="Description"
                                editor={(options) => textEditor(options)}
                            />

                            <Column
                                field="state"
                                body={(options) =>
                                    Status(options, handleStatusChange)
                                }
                                header="Status"
                                editor={(options) => statusEditor(options)}
                            />

                            <Column
                                rowEditor
                                headerStyle={{ width: "10%", minWidth: "8rem" }}
                                bodyStyle={{ textAlign: "end" }}
                            />
                            <Column
                                body={(options) =>
                                    DeleteColumn(options, handleDelete)
                                }
                                bodyStyle={{ width: "10px" }}
                            />
                        </DataTable>
                    ) : (
                        <div className="text-center">No subtasks found</div>
                    )}
                    <div className="flex justify-content-end">
                        <Button
                            onClick={() => toggleCreateMode(true)}
                            icon="pi pi-plus"
                            label="Add"
                            className="p-button-outlined align-self-end text-center mt-2 mr-1"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubTasksOverview;
