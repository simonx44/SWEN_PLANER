import { FC, useMemo } from "react";
import { matchRoutes, RouteMatch, useLocation } from "react-router-dom";
import TaskOverview from "../components/TaskOverview";
import { TasksProvider } from "../context/TasksContext";
import { ITaskFilter, TaskStatus } from "../types";
import routes, { IRoute } from "./ApplicationRoutes";
import { TaskTransformation } from "../helper/TaskTransformationHelper";

const FilteredTaskOverview: FC = () => {
    const location = useLocation();
    const matchedRoutes = matchRoutes(routes, location);

    const createFilterWithListId = (routeInfo: RouteMatch): ITaskFilter => {
        const listId = routeInfo.params.id;
        return { listId: listId ?? undefined };
    };

    const createFilterWithDate = (): ITaskFilter => {
        return { date: TaskTransformation.getCurrentDate() };
    };
    const createFilterWithOpen = (): ITaskFilter => {
        return { status: TaskStatus.OPEN };
    };

    const createFilterWithClosed = (): ITaskFilter => {
        return { status: TaskStatus.CLOSED };
    };
    const createFilterWithPriority = (): ITaskFilter => {
        return { prio: true };
    };

    const createFilter = (): ITaskFilter => {
        if (!matchedRoutes || matchedRoutes.length === 0) return {};
        const routeInfo = matchedRoutes[0];
        const route = routeInfo.route as IRoute;

        switch (route.path) {
            case "/list/:id":
                return createFilterWithListId(routeInfo);
            case "/date":
                return createFilterWithDate();
            case "/open":
                return createFilterWithOpen();
            case "/closed":
                return createFilterWithClosed();
            case "/prio":
                return createFilterWithPriority();
            default:
                return {};
        }
    };

    const filter = useMemo(createFilter, [location]);

    return (
        <TasksProvider filter={filter}>
            <TaskOverview />
        </TasksProvider>
    );
};

export default FilteredTaskOverview;
