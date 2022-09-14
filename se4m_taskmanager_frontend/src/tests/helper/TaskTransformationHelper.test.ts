import { TaskTransformation } from "../../helper/TaskTransformationHelper";

describe("TaskTransformationHelper", () => {
    test("getCurrentDate", () => {
        const regix = /(\d{4}-\d{2}-\d{2})/;
        const date = TaskTransformation.getCurrentDate();
        expect(date.match(regix)).toBeTruthy();
    });

    describe("transformEffortToInternalFormat", () => {
        test("valid response", () => {
            const regix = /(\d{2}:\d{2})/;
            const effort = TaskTransformation.transformEffortToInternalFormat(30);
            const effort2 = TaskTransformation.transformEffortToInternalFormat(90);
            expect(effort.match(regix)).toBeTruthy();
            expect(effort).toBe("00:30");
            expect(effort2.match(regix)).toBeTruthy();
            expect(effort2).toBe("01:30");
        });

        test("invalid input", () => {
            expect(TaskTransformation.transformEffortToInternalFormat).toThrow(
                Error
            );

            try {
                TaskTransformation.transformEffortToInternalFormat("s" as any);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe("transformInternalEffortFormatToNumber", () => {
        test("valid response", () => {
            const regix = /(\d{2}:\d{2})/;
            const effort = TaskTransformation.transformInternalEffortFormatToNumber(
                "00:30"
            );
            const effort2 = TaskTransformation.transformInternalEffortFormatToNumber(
                "01:34"
            );

            expect(effort).toBe(30);
            expect(effort2).toBe(94);
        });

        test("invalid input", () => {
            expect(
                TaskTransformation.transformInternalEffortFormatToNumber
            ).toThrow(Error);

            try {
                TaskTransformation.transformInternalEffortFormatToNumber(
                    "s" as any
                );
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe("transformDate", () => {
        test("valid response", () => {
            const date = TaskTransformation.transformDate("2022-10-10");
            const date2 = TaskTransformation.transformDate("2022-ss10-10");
            const date3 = TaskTransformation.transformDate("2022-40-40");
            expect(date).toBe("10/Oct/2022");
            expect(date3).toBe("-");
            expect(date2).toBe("-");
        });
    });
});
