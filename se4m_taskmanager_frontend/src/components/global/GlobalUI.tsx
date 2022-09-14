import React from "react";
import { useLocation, matchRoutes, RouteMatch } from "react-router-dom";
import routes from "../../routes/ApplicationRoutes";
import { connector, ListStoreProps } from "../../redux/listStore/lists";

const GlobalUI: React.FC<ListStoreProps> = ({ lists }) => {
    const location = useLocation();
    const matchedRoutes = matchRoutes(routes, location);

    const getListById = (matched: RouteMatch[]) => {
        const emptyReponse = { name: "", description: "" };
        if (!matched || matched.length === 0) return emptyReponse;
        const { id } = matched[0].params;

        const taskList = lists.find((list) => list.listId === id);

        if (!taskList) {
            return emptyReponse;
        }
        return { name: taskList.title, description: taskList.description };
    };

    const getRouteInfomation = () => {
        const { pathname } = location;

        if (pathname.includes("/list/") && matchedRoutes) {
            return getListById(matchedRoutes);
        }

        const routeInfo = routes.find((route) => route.path === pathname);

        if (routeInfo) {
            return { name: routeInfo.name, description: routeInfo.description };
        }
        return { name: "", description: "" };
    };

    const headerInfo = getRouteInfomation();

    return (
        <header>
            <div className="flex flex-row justify-content-between">
                <div>
                    <h2>{headerInfo.name}</h2>
                    <span>{headerInfo.description}</span>
                </div>
            </div>
        </header>
    );
};

export default connector(GlobalUI);
