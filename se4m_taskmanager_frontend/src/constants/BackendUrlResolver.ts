/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-empty */
/* eslint-disable prefer-const */
import { ITaskFilter } from "../types";

export default class BackendUrlResolver {
    static readonly BACKEND_BASE_URL = "http://localhost:8080";

    static readonly TASKS = "/tasks";

    static readonly PRIORITIZED_TASKS = "/tasks/priority";

    static readonly TASKLISTS = "/lists";

    static readonly SUBTASKS = "/subtasks";

    static readonly LOGIN_PATH = "/auth/login";

    static readonly USER_PATH = "/auth/user";

    static readonly SIGNUP_PATH = "/auth/register";

    static getTasksUrl() {
        return this.BACKEND_BASE_URL + this.TASKS;
    }

    static getTasksUrlWithQueryParameters(filters: ITaskFilter) {
        const url = this.BACKEND_BASE_URL + this.TASKS;

        const params = new URLSearchParams();

        if (filters.prio) {
            return `${this.BACKEND_BASE_URL}${this.PRIORITIZED_TASKS}`;
        }

        let useParams = false;

        for (let filter in filters) {
            const value = filters[filter as keyof ITaskFilter];
            if (value) {
                useParams = true;
                params.append(filter, value.toString());
            }
        }

        return useParams ? `${url}?${params.toString()}` : url;
    }

    static getSubTasksUrl(id: string) {
        return `${this.BACKEND_BASE_URL}${this.TASKS}/${id}${this.SUBTASKS}`;
    }

    static getTaskListsUrl(listId?: string) {
        if (listId) {
            return `${this.BACKEND_BASE_URL}${this.TASKLISTS}/${listId}`;
        }
        return `${this.BACKEND_BASE_URL}${this.TASKLISTS}`;
    }

    static deleteTaskListsUrl(listId: string, deleteTasksToo: boolean) {
        return `${this.BACKEND_BASE_URL}${this.TASKLISTS}/${listId}?deleteTasksTooFlag=${deleteTasksToo}`;
    }

    static getLoginUrl() {
        return `${this.BACKEND_BASE_URL}${this.LOGIN_PATH}`;
    }

    static getRegisterUrl() {
        return `${this.BACKEND_BASE_URL}${this.SIGNUP_PATH}`;
    }

    static getUserUrl() {
        return `${this.BACKEND_BASE_URL}${this.USER_PATH}`;
    }
}
