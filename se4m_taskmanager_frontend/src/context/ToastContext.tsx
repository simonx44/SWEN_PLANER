/* eslint-disable react/function-component-definition */
import { Toast } from "primereact/toast";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

export enum ToastType {
    SUCCESS,
    ERROR,
    WARNING,
}

export type IToastMessage = {
    message: string;
    type: ToastType;
};

type IToastContext = {
    messages: Array<IToastMessage>;
    pushMessage: (message: IToastMessage) => void;
};

const ToastContext = React.createContext<IToastContext>({} as IToastContext);

export function useGlobalToasts() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }: React.PropsWithChildren<{}>) {
    const [messages, updateMessage] = useState<IToastMessage[]>([]);
    const toast = useRef(null);
    const addNewMessage = (message: IToastMessage) => {
        updateMessage([...messages, message]);
    };

    const context = useMemo(
        () => ({ messages, pushMessage: addNewMessage }),
        [messages]
    );

    useEffect(() => {
        if (messages.length > 0) {
            showMessage(messages[messages.length - 1]);
        }
    }, [messages]);

    const showMessage = (message: IToastMessage) => {
        if (toast.current) {
            const type = message.type === ToastType.ERROR ? "error" : "success";
            // @ts-ignore
            toast.current.show({
                severity: type,
                summary: "Success",
                detail: message.message,
                life: 3000,
            });
        }
    };

    return (
        <ToastContext.Provider value={context}>
            <Toast ref={toast} position="bottom-right" />
            {children}
        </ToastContext.Provider>
    );
}
