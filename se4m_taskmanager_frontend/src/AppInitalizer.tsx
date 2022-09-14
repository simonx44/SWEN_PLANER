import { FC, useEffect } from "react";
import { ToastType, useGlobalToasts } from "./context/ToastContext";
import { TASKLIST_INSTANCE } from "./services/listService";

const AppInitalizer: FC = () => {
    const { pushMessage } = useGlobalToasts();

    useEffect(() => {
        TASKLIST_INSTANCE.getAllLists().catch((error) => {
            pushMessage({ message: error.message, type: ToastType.ERROR });
        });
    }, []);

    return null;
};

export default AppInitalizer;
