import { AxiosResponse } from "axios";
import { TaskTransformation } from "../helper/TaskTransformationHelper";
import {
    ICreateSubTaskDTO,
    ICreateTaskDTO,
    IModifyTaskDTO,
    ISubTask,
    ITask,
    ITaskFilter,
    Priority,
} from "../types";
import BackendUrlResolver from "../constants/BackendUrlResolver";
import Messages from "../constants/Messages";
import HttpService from "./httpService";

class TaskService {
    constructor(private httpService: HttpService) {}

    public async getAllTasks(filter?: ITaskFilter) {
        try {
            let url = "";

            if (filter) {
                url = BackendUrlResolver.getTasksUrlWithQueryParameters(filter);
            } else {
                url = BackendUrlResolver.getTasksUrl();
            }

            const response: AxiosResponse<Array<ITask>> = await this.httpService
                .getAxios()
                .get(url);

            if (response.status !== 200) {
                throw new Error(
                    Messages.TaskService.TaskExceptionMessages.TASKS_NOT_FOUND
                );
            }

            return response.data.map((task) => ({
                ...task,
                priority:
                    Priority[task.priority as any as keyof typeof Priority],
            }));
        } catch (error) {
            throw new Error(
                Messages.TaskService.TaskExceptionMessages.TASKS_NOT_FOUND
            );
        }
    }

    public async createTask(task: ICreateTaskDTO) {
        try {
            const url = BackendUrlResolver.getTasksUrl();

            const body = {
                dueDay: task.date,
                plannedEffort:
                    TaskTransformation.transformInternalEffortFormatToNumber(
                        task.plannedEffort
                    ),
                priority: Priority[task.priority],
                taskDescription: task.description,
                taskTitle: task.title,
                listId: task.listId ?? null,
            };

            const response: AxiosResponse<ITask> = await this.httpService
                .getAxios()
                .post<any>(url, body);

            if (response.status !== 202) {
                throw new Error();
            }

            return response.data;
        } catch (error) {
            throw new Error(
                Messages.TaskService.TaskExceptionMessages.TASK_COULD_NOT_CREATED
            );
        }
    }

    public async modifyTask(taskId: string, task: ITask) {
        try {
            const url = BackendUrlResolver.getTasksUrl();

            const body: IModifyTaskDTO = {
                dueDay: task.dueDay,
                plannedEffort: task.plannedEffort,
                priority: task.priority,
                status: task.state,
                taskDescription: task.taskDescription,
                taskTitle: task.taskTitle,
                listId: task.list?.listId,
            };

            const response: AxiosResponse<ITask> = await this.httpService
                .getAxios()
                .patch<any>(`${url}/${taskId}`, body);

            if (response.status !== 204) {
                throw new Error();
            }

            return Messages.TaskService.TaskSuccessMessages.TASK_STATE_UPDATED;
        } catch (error) {
            throw new Error(
                Messages.TaskService.TaskExceptionMessages.TASK_COULD_NOT_BE_UPDATED
            );
        }
    }

    public async deleteTask(taskId: string) {
        try {
            const url = BackendUrlResolver.getTasksUrl();

            const response: AxiosResponse<ITask> = await this.httpService
                .getAxios()
                .delete<any>(`${url}/${taskId}`);

            if (response.status !== 202) {
                throw new Error();
            }

            return Messages.TaskService.TaskSuccessMessages.TASK_DELETED;
        } catch (error) {
            throw new Error(
                Messages.TaskService.TaskExceptionMessages.TASK_COULD_NOT_DELETED
            );
        }
    }

    public async createSubTask(taskId: string, subTask: ICreateSubTaskDTO) {
        try {
            const url = BackendUrlResolver.getSubTasksUrl(taskId);

            const response: AxiosResponse<ISubTask> = await this.httpService
                .getAxios()
                .post(url, subTask);

            if (response.status !== 202) {
                throw new Error();
            }

            return response.data;
        } catch (error) {
            throw new Error(
                Messages.TaskService.TaskExceptionMessages.SUBTASK_COULD_NOT_CREATED
            );
        }
    }

    public async deleteSubTask(taskId: string, subTaskId: string) {
        try {
            const url = BackendUrlResolver.getSubTasksUrl(taskId);

            const response: AxiosResponse<ITask> = await this.httpService
                .getAxios()
                .delete<any>(`${url}/${subTaskId}`);

            if (response.status !== 204) {
                throw new Error();
            }

            return Messages.TaskService.TaskSuccessMessages.TASK_DELETED;
        } catch (error) {
            throw new Error(
                Messages.TaskService.TaskExceptionMessages.TASK_COULD_NOT_DELETED
            );
        }
    }

    public async modifySubTask(taskId: string, subTask: ISubTask) {
        try {
            const url = BackendUrlResolver.getSubTasksUrl(taskId);

            const updatedSubTask = {
                status: subTask.state,
                subTaskDescription: subTask.subtaskDescription,
                subTaskTitle: subTask.subtaskTitle,
            };

            const response: AxiosResponse<ISubTask> = await this.httpService
                .getAxios()
                .patch(`${url}/${subTask.subtaskId}`, updatedSubTask);

            if (response.status !== 204) {
                throw new Error();
            }

            return response.data;
        } catch (error) {
            throw new Error(
                Messages.TaskService.TaskExceptionMessages.SUBTASK_COULD_NOT_CREATED
            );
        }
    }
}

const TASKSERVICE_INSTANCE = new TaskService(new HttpService());
export { TaskService, TASKSERVICE_INSTANCE };
