/* eslint-disable prefer-destructuring */
import { listStoreAccessManager } from "redux/listStore/ListStoreAccessManager";
import { listsTestData } from "./testData/listData";

describe("ListStoreAccessManager - tests", () => {
    beforeEach(() => {
        listStoreAccessManager.updateLists([]);
    });

    test("toggleLoading", () => {
        let isLoading = listStoreAccessManager.getState().isLoading;

        expect(isLoading).toBeFalsy();
        listStoreAccessManager.toggleLoading();
        isLoading = listStoreAccessManager.getState().isLoading;
        expect(isLoading).toBeTruthy();
    });

    test("updateLists", () => {
        let lists = listStoreAccessManager.getState().lists;

        expect(lists).toHaveLength(0);
        listStoreAccessManager.updateLists(listsTestData);
        lists = listStoreAccessManager.getState().lists;
        expect(lists).toHaveLength(4);
    });
    test("addNewList", () => {
        let lists = listStoreAccessManager.getState().lists;

        expect(lists).toHaveLength(0);
        listStoreAccessManager.addNewList(listsTestData[0]);
        lists = listStoreAccessManager.getState().lists;
        expect(lists).toHaveLength(1);
    });
    test("deleteList", () => {
        let lists = listStoreAccessManager.getState().lists;
        listStoreAccessManager.updateLists(listsTestData);
        expect(lists).toHaveLength(0);
        lists = listStoreAccessManager.getState().lists;
        expect(lists).toHaveLength(4);
        listStoreAccessManager.deleteList(listsTestData[2].listId);
        lists = listStoreAccessManager.getState().lists;
        expect(lists).toHaveLength(3);
    });

    test("modifyList", () => {
        listStoreAccessManager.updateLists(listsTestData);
        const listToUpdate = { ...listsTestData[0] };
        listToUpdate.title = "Unit";

        listStoreAccessManager.modifyList(listToUpdate.listId, listToUpdate);
        const lists = listStoreAccessManager.getState().lists;
        expect(lists[0].title).toBe("Unit");
    });
});
