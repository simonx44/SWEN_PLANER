import { FC } from "react";
import MyTasksPage from "./MyTasksPage";
import FilteredTaskOverview from "./FilteredTaskOverview";

export interface IRoute {
    isSidebarRoute: boolean;
    component: FC;
    icon?: string;
    name: string;
    description: string;
    path: string;
}

const routes: IRoute[] = [
    {
        isSidebarRoute: true,
        component: MyTasksPage,
        icon: "pi-book",
        path: "/",
        name: "My Tasks",
        description: "Overview of your tasks",
    },
    {
        isSidebarRoute: true,
        component: FilteredTaskOverview,
        icon: "pi-sun",
        path: "/date",
        name: "My Day",
        description: "Overview of your tasks today",
    },
    {
        isSidebarRoute: true,
        component: FilteredTaskOverview,
        icon: "pi-folder-open",
        path: "/open",
        name: "Open Tasks",
        description: "Overview of your open tasks",
    },
    {
        isSidebarRoute: true,
        component: FilteredTaskOverview,
        icon: "pi-check-square",
        path: "/closed",
        name: "Closed Tasks",
        description: "Overview of your closed tasks",
    },
    {
        isSidebarRoute: true,
        component: FilteredTaskOverview,
        icon: "pi-star",
        path: "/prio",
        name: "Prioritized",
        description: "Overview of your prioritized tasks",
    },
    {
        isSidebarRoute: false,
        component: FilteredTaskOverview,
        name: "List overview",
        path: "/list/:id",
        description: "Overview of your list",
    },
];

export default routes;
