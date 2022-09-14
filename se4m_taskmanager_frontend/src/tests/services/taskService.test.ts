/* eslint-disable no-restricted-syntax */
import Messages from "constants/Messages";
import HttpService from "services/httpService";
import BackendUrlResolver from "constants/BackendUrlResolver";
import { TaskService } from "services/taskService";
import { ICreateTaskDTO, ITask, Priority, TaskStatus } from "types";
import { createAxiosMock } from "./_mocks_/httpService";
import { unfilteredData, taskCreated } from "./testData/tasksData";

jest.mock("services/httpService");
jest.mock("constants/BackendUrlResolver");

describe("task Service - tests", () => {
    let taskService: TaskService;

    beforeAll(() => {
        // @ts-ignore
        HttpService.mockClear();
        // @ts-ignore
        BackendUrlResolver.mockClear();

        taskService = new TaskService(new HttpService());
    });
    describe("getAllTasks - tests", () => {
        test("successfull call - no filter", async () => {
            jest.spyOn(HttpService.prototype, "getAxios").mockImplementation(
                () => createAxiosMock(200, unfilteredData) as any
            );

            const result = await taskService.getAllTasks();
            expect(result).toHaveLength(unfilteredData.length);
            expect(BackendUrlResolver.getTasksUrl).toBeCalledTimes(1);
            expect(
                BackendUrlResolver.getTasksUrlWithQueryParameters
            ).toBeCalledTimes(0);

            for (const task of unfilteredData) {
                const doesItemExist = result.some(
                    (el) => el.taskId === task.taskId
                );
                expect(doesItemExist).toBeTruthy();
            }
        });

        test("successfull call - filter", async () => {
            jest.spyOn(HttpService.prototype, "getAxios").mockImplementation(
                () => createAxiosMock(200, unfilteredData) as any
            );

            const result = await taskService.getAllTasks({ listId: "d" });
            expect(result).toHaveLength(unfilteredData.length);
            expect(BackendUrlResolver.getTasksUrl).toBeCalledTimes(0);
            expect(
                BackendUrlResolver.getTasksUrlWithQueryParameters
            ).toBeCalledTimes(1);
        });

        test("error", async () => {
            try {
                jest.spyOn(
                    HttpService.prototype,
                    "getAxios"
                ).mockImplementation(() => createAxiosMock(400, []) as any);

                await taskService.getAllTasks();
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBe(
                    Messages.TaskService.TaskExceptionMessages.TASKS_NOT_FOUND
                );
            }
        });
    });
    describe("createTask - tests", () => {
        const taskToCreate: ICreateTaskDTO = {
            title: "test",
            description: "test",
            priority: Priority.HIGH,
            date: new Date(),
            plannedEffort: "00:30",
        };
        test("successfull call", async () => {
            jest.spyOn(HttpService.prototype, "getAxios").mockImplementation(
                () => createAxiosMock(202, taskCreated) as any
            );

            const result = await taskService.createTask(taskToCreate);
            expect(taskCreated).toBe(result);
            expect(BackendUrlResolver.getTasksUrl).toBeCalledTimes(1);
        });

        test("error", async () => {
            try {
                jest.spyOn(
                    HttpService.prototype,
                    "getAxios"
                ).mockImplementation(() => createAxiosMock(400, []) as any);

                await taskService.createTask(taskToCreate);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBe(
                    Messages.TaskService.TaskExceptionMessages
                        .TASK_COULD_NOT_CREATED
                );
            }
        });
    });
    describe("modifyTask - tests", () => {
        const taskToModify: ITask = {
            taskId: "1",
            taskTitle: "test",
            taskDescription: "test",
            priority: Priority.HIGH,
            dueDay: new Date(),
            plannedEffort: 30,
            assignedUser: "",
            startDate: new Date(),
            subTaskList: [],
            state: TaskStatus.OPEN,
        };
        test("successfull call", async () => {
            jest.spyOn(HttpService.prototype, "getAxios").mockImplementation(
                () => createAxiosMock(204, taskCreated) as any
            );

            const result = await taskService.modifyTask("id", taskToModify);
            expect(result).toBe(
                Messages.TaskService.TaskSuccessMessages.TASK_STATE_UPDATED
            );
            expect(BackendUrlResolver.getTasksUrl).toBeCalledTimes(1);
        });

        test("error", async () => {
            try {
                jest.spyOn(
                    HttpService.prototype,
                    "getAxios"
                ).mockImplementation(() => createAxiosMock(400, []) as any);

                await taskService.modifyTask("id", taskToModify);
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBe(
                    Messages.TaskService.TaskExceptionMessages
                        .TASK_COULD_NOT_BE_UPDATED
                );
            }
        });
    });
    describe("deleteTask - tests", () => {
        test("successfull call", async () => {
            jest.spyOn(HttpService.prototype, "getAxios").mockImplementation(
                () => createAxiosMock(202, taskCreated) as any
            );

            const result = await taskService.deleteTask("id");
            expect(result).toBe(
                Messages.TaskService.TaskSuccessMessages.TASK_DELETED
            );
            expect(BackendUrlResolver.getTasksUrl).toBeCalledTimes(1);
        });

        test("error", async () => {
            try {
                jest.spyOn(
                    HttpService.prototype,
                    "getAxios"
                ).mockImplementation(() => createAxiosMock(400, []) as any);

                await taskService.deleteTask("id");
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBe(
                    Messages.TaskService.TaskExceptionMessages
                        .TASK_COULD_NOT_DELETED
                );
            }
        });
    });
});
