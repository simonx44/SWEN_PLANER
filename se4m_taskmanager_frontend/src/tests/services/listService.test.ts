import Messages from "constants/Messages";
import { listStoreAccessManager } from "redux/listStore/ListStoreAccessManager";
import HttpService from "services/httpService";
import { TASKLIST_INSTANCE, ListService } from "services/listService";
import { ICreateListDTO } from "types/TaskList";
import { createAxiosMock } from "./_mocks_/httpService";

jest.mock("services/httpService");

describe("list Service - tests", () => {
    let listService = null;
    let spyToggleLoading: jest.SpyInstance | undefined;
    let spyStoreUpdateLists: jest.SpyInstance | undefined;
    let spyStoreAddList: jest.SpyInstance | undefined;
    let spyStoreDeleteList: jest.SpyInstance | undefined;
    let spyStoreModifyList: jest.SpyInstance | undefined;
    beforeAll(() => {
        // @ts-ignore
        HttpService.mockClear();
        spyToggleLoading = jest.spyOn(listStoreAccessManager, "toggleLoading");
        spyStoreAddList = jest.spyOn(listStoreAccessManager, "addNewList");
        spyStoreUpdateLists = jest.spyOn(listStoreAccessManager, "updateLists");
        spyStoreDeleteList = jest.spyOn(listStoreAccessManager, "deleteList");
        spyStoreModifyList = jest.spyOn(listStoreAccessManager, "modifyList");

        listService = new ListService(
            new HttpService(),
            listStoreAccessManager
        );
    });
    describe("getAllLists - tests", () => {
        test("successfull call", async () => {
            jest.spyOn(HttpService.prototype, "getAxios").mockImplementation(
                () => createAxiosMock(200, []) as any
            );

            await TASKLIST_INSTANCE.getAllLists();
            expect(spyStoreUpdateLists).toBeCalledTimes(1);
            expect(spyToggleLoading).toBeCalledTimes(2);
        });

        test("error", async () => {
            try {
                jest.spyOn(
                    HttpService.prototype,
                    "getAxios"
                ).mockImplementation(() => createAxiosMock(400, []) as any);

                await TASKLIST_INSTANCE.getAllLists();
            } catch (error) {
                expect(spyToggleLoading).toBeCalledTimes(2);
                expect(error).toBeDefined();
            }
        });
    });

    describe("createList - tests", () => {
        const listToCreate: ICreateListDTO = {
            description: "test",
            title: "title",
        };
        test("successfull call", async () => {
            jest.spyOn(HttpService.prototype, "getAxios").mockImplementation(
                () => createAxiosMock(201, []) as any
            );

            await TASKLIST_INSTANCE.createList(listToCreate);
            expect(spyStoreUpdateLists).toBeCalledTimes(0);
            expect(spyStoreAddList).toBeCalledTimes(1);
            expect(spyToggleLoading).toBeCalledTimes(0);
        });

        test("error", async () => {
            try {
                jest.spyOn(
                    HttpService.prototype,
                    "getAxios"
                ).mockImplementation(() => createAxiosMock(400, []) as any);

                await TASKLIST_INSTANCE.createList(listToCreate);
            } catch (error: any) {
                expect(spyToggleLoading).toBeCalledTimes(0);
                expect(error.message).toBe(
                    Messages.ListService.ListExceptionMessages
                        .LISTS_COULD_NOT_BE_CREATED
                );
            }
        });
    });

    describe("deleteList - tests", () => {
        test("successfull call", async () => {
            jest.spyOn(HttpService.prototype, "getAxios").mockImplementation(
                () => createAxiosMock(202, []) as any
            );

            await TASKLIST_INSTANCE.deleteList("sajsj", false);
            expect(spyStoreDeleteList).toBeCalledTimes(1);
            expect(spyStoreAddList).toBeCalledTimes(0);
            expect(spyToggleLoading).toBeCalledTimes(2);
        });

        test("error", async () => {
            try {
                jest.spyOn(
                    HttpService.prototype,
                    "getAxios"
                ).mockImplementation(() => createAxiosMock(400, []) as any);

                await TASKLIST_INSTANCE.deleteList("s", true);
            } catch (error: any) {
                expect(spyToggleLoading).toBeCalledTimes(2);
                expect(error.message).toBe(
                    Messages.ListService.ListExceptionMessages
                        .LISTS_NOT_DELETEABLE
                );
            }
        });
    });

    describe("modifyList - tests", () => {
        const listToModify: ICreateListDTO = {
            description: "test",
            title: "title",
        };
        test("successfull call", async () => {
            jest.spyOn(HttpService.prototype, "getAxios").mockImplementation(
                () => createAxiosMock(202, []) as any
            );

            await TASKLIST_INSTANCE.modifyList("sajsj", listToModify);
            expect(spyStoreDeleteList).toBeCalledTimes(0);
            expect(spyStoreAddList).toBeCalledTimes(0);
            expect(spyToggleLoading).toBeCalledTimes(2);
            expect(spyStoreModifyList).toBeCalledTimes(1);
        });

        test("error", async () => {
            try {
                jest.spyOn(
                    HttpService.prototype,
                    "getAxios"
                ).mockImplementation(() => createAxiosMock(400, []) as any);

                await TASKLIST_INSTANCE.modifyList("sajsj", listToModify);
            } catch (error: any) {
                expect(spyToggleLoading).toBeCalledTimes(2);
                expect(error.message).toBe(
                    Messages.ListService.ListExceptionMessages
                        .LISTS_COULD_NOT_BE_MODIFIED
                );
            }
        });
    });
});
