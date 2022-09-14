import { TaskList } from "../../types/TaskList";
import { store } from "../store";
import { mapDispatch, ListsState } from "./lists";

class ListStoreAccessManager {
    private listStore: any;

    constructor(listStore: any) {
        this.listStore = listStore;
    }

    public getState(): ListsState {
        return this.listStore.getState().list;
    }

    public toggleLoading() {
        this.listStore.dispatch(mapDispatch.toggleLoading());
    }

    public updateLists(lists: Array<TaskList>) {
        this.listStore.dispatch(mapDispatch.updateLists(lists));
    }

    public addNewList(list: TaskList) {
        this.listStore.dispatch(mapDispatch.addList(list));
    }

    public deleteList(listId: string) {
        this.listStore.dispatch(mapDispatch.removeList(listId));
    }

    public modifyList(listId: string, modifiedList: TaskList) {
        this.listStore.dispatch(
            mapDispatch.modifyList({ listId, modifiedList })
        );
    }
}

const listStoreAccessManager = new ListStoreAccessManager(store);
export { listStoreAccessManager, ListStoreAccessManager };
