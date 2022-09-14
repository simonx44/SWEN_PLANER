import { FC } from "react";
import TaskOverview from "../components/TaskOverview";
import { TasksProvider } from "../context/TasksContext";

const MyTaskPage: FC = () => {
    return (
        <TasksProvider>
            <TaskOverview />
        </TasksProvider>
    );
};

export default MyTaskPage;
