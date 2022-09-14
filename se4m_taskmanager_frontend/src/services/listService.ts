import { AxiosResponse } from "axios";
import BackendUrlResolver from "../constants/BackendUrlResolver";
import Messages from "../constants/Messages";
import {
    ListStoreAccessManager,
    listStoreAccessManager,
} from "../redux/listStore/ListStoreAccessManager";
import { ICreateListDTO, TaskList } from "../types/TaskList";
import HttpService from "./httpService";

class ListService {
    constructor(
        private httpService: HttpService,

        private listStoreManager: ListStoreAccessManager
    ) {}

    public async getAllLists() {
        try {
            this.listStoreManager.toggleLoading();
            const url = BackendUrlResolver.getTaskListsUrl();

            const response: AxiosResponse<Array<TaskList>> = await this.httpService.getAxios().get(url);

            if (response.status !== 200) {
                throw new Error(
                    Messages.ListService.ListExceptionMessages.LISTS_NOT_FOUND
                );
            }

            this.listStoreManager.updateLists(response.data);
        } catch (error) {
            throw new Error(
                Messages.ListService.ListExceptionMessages.LISTS_NOT_FOUND
            );
        } finally {
            this.listStoreManager.toggleLoading();
        }
    }

    public async createList(list: ICreateListDTO) {
        try {
            const url = BackendUrlResolver.getTaskListsUrl();

            const response: AxiosResponse<TaskList> = await this.httpService
                .getAxios()
                .post<any>(url, list);

            if (response.status !== 201) {
                throw new Error();
            }

            this.listStoreManager.addNewList(response.data);

            return response.data;
        } catch (error) {
            throw new Error(
                Messages.ListService.ListExceptionMessages.LISTS_COULD_NOT_BE_CREATED
            );
        }
    }

    public async deleteList(listId: string, deleteRelatedTasks: boolean) {
        this.listStoreManager.toggleLoading();
        try {
            const url = BackendUrlResolver.deleteTaskListsUrl(
                listId,
                deleteRelatedTasks
            );

            const response: AxiosResponse = await this.httpService
                .getAxios()
                .delete<any>(url);

            if (response.status !== 202) {
                throw new Error();
            }
            this.listStoreManager.deleteList(listId);

            return Messages.ListService.ListSuccessMessages.LIST_DELETED;
        } catch (error) {
            throw new Error(
                Messages.ListService.ListExceptionMessages.LISTS_NOT_DELETEABLE
            );
        } finally {
            this.listStoreManager.toggleLoading();
        }
    }

    public async modifyList(listId: string, list: ICreateListDTO) {
        this.listStoreManager.toggleLoading();
        try {
            const url = BackendUrlResolver.getTaskListsUrl(listId);

            const response: AxiosResponse = await this.httpService
                .getAxios()
                .patch<any>(url, list);

            if (response.status !== 202) {
                throw new Error();
            }

            this.listStoreManager.modifyList(listId, {
                ...list,
                listId,
            } as TaskList);

            return Messages.ListService.ListSuccessMessages.LIST_UPDATED;
        } catch (error) {
            throw new Error(
                Messages.ListService.ListExceptionMessages.LISTS_COULD_NOT_BE_MODIFIED
            );
        } finally {
            this.listStoreManager.toggleLoading();
        }
    }
}

const TASKLIST_INSTANCE = new ListService(
    new HttpService(),
    listStoreAccessManager
);
export { ListService, TASKLIST_INSTANCE };
