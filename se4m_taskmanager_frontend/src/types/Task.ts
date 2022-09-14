import { TaskList } from "./TaskList";

export type ITask = {
    taskId: string;
    priority: Priority;
    assignedUser: string;
    taskTitle: string;
    taskDescription: string;
    startDate: Date;
    dueDay: Date;
    plannedEffort: number;
    list?: TaskList;
    subTaskList: Array<ISubTask>;
    state: TaskStatus;
};

export type ITaskFilter = {
    date?: string;
    status?: TaskStatus;
    listId?: string;
    prio?: boolean;
};

export type ISubTask = {
    state: TaskStatus;
    subtaskDescription: string;
    subtaskTitle: string;
    subtaskId: string;
    added?: boolean;
};

export type ICreateSubTaskDTO = {
    state?: TaskStatus;
    subTaskDescription: string;
    subTaskTitle: string;
};

export type ICreateTaskDTO = {
    title: string;
    description: string;
    priority: Priority;
    date: Date;
    listId?: string;
    plannedEffort: string;
};

export enum TaskStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
}

export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
}

export type IModifyTaskDTO = {
    dueDay: Date;
    plannedEffort: number;
    priority: Priority;
    status: string;
    listId?: string;
    taskDescription: string;
    taskTitle: string;
};
