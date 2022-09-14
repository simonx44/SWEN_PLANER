import React from "react";
import "./Navigation.scss";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import profileImg from "../../assets/profile_owl.png";
import ListForm from "../forms/ListForm";
import routes from "../../routes/ApplicationRoutes";
import { connector, ListStoreProps } from "../../redux/listStore/lists";
import { TaskList } from "../../types/TaskList";
import { TASKLIST_INSTANCE } from "../../services/listService";
import { ToastType, useGlobalToasts } from "../../context/ToastContext";

const Component: React.FC<ListStoreProps> = ({
    isLoading,
    lists,
    toggleLoading,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { pushMessage } = useGlobalToasts();
    const [isCreateModeOpen, toggleCreateMode] = React.useState<boolean>(false);
    const [confirmModal, updateConfirmModal] = React.useState({
        isOpen: false,
        message: "",
        header: "",
        accept: () => {},
        reject: () => {},
    });
    const showList = (listId: string) => {
        navigate(`/list/${listId}`);
    };

    const isListActive = (listId: string) => {
        const { pathname } = location;
        if (pathname === `/list/${listId}`) return true;
        return false;
    };

    const deleteList = (listId: string, deleteAllTasks: boolean) => {
        TASKLIST_INSTANCE.deleteList(listId, deleteAllTasks)
            .then((res: string) => {
                pushMessage({ message: res, type: ToastType.SUCCESS });
                navigate("/");
            })
            .catch((error: Error) => {
                pushMessage({ message: error.message, type: ToastType.ERROR });
            });
    };

    const decideOnDeleteAllTasks = (list: TaskList) => {
        setTimeout(() => {
            updateConfirmModal((prev) => ({
                ...prev,
                message: "Do you want to delete all related tasks",
                header: "Delete list related Tasks",
                isOpen: true,
                accept: () => deleteList(list.listId, true),
                reject: () => deleteList(list.listId, false),
            }));
        });
    };

    const confirmDelete = (list: TaskList) => {
        updateConfirmModal({
            message: "Are you sure you want to proceed?",
            header: `Delete list ${list.title}`,
            isOpen: true,
            accept: () => decideOnDeleteAllTasks(list),
            reject: () => {},
        });
    };

    const closeConfirmDialog = () => {
        updateConfirmModal({ ...confirmModal, isOpen: false });
    };

    return (
        <>
            <Dialog
                visible={isCreateModeOpen}
                onHide={() => {
                    toggleCreateMode(!isCreateModeOpen);
                }}
                breakpoints={{ "960px": "75vw", "640px": "100vw" }}
                style={{ width: "50vw" }}
                header="Create new list"
                draggable={false}
                resizable={false}
            >
                <ListForm closeModal={() => toggleCreateMode(false)} />
            </Dialog>
            <ConfirmDialog
                visible={confirmModal.isOpen}
                onHide={closeConfirmDialog}
                message={confirmModal.message}
                header={confirmModal.header}
                icon="pi pi-exclamation-triangle"
                accept={confirmModal.accept}
                reject={confirmModal.reject}
            />

            <aside className="sidebar">
                <div className="sidebar__profile">
                    <Avatar shape="circle" image={profileImg} />
                    <div className="sidebar__profile__name">Your name</div>
                </div>
                <div className="sidebar__routes">
                    {routes.map((route) => (
                        <li
                            key={route.path}
                            className={`sidebar__routes__route ${
                                route.path === location.pathname ? "active" : ""
                            } ${!route.isSidebarRoute ? "hidden" : ""}`}
                        >
                            <Link to={route.path}>
                                <i className={`pi ${route.icon}`} />
                                <span>{route.name}</span>
                            </Link>
                        </li>
                    ))}
                </div>
                <div className="sidebar__lists">
                    <div className="sidebar__lists__title">
                        <i className="pi pi-list" />
                        Your lists
                    </div>

                    {isLoading ? (
                        <div className="sidebar__lists__content">
                            <ProgressSpinner className="sidebar__lists__content__loading" />
                        </div>
                    ) : (
                        <div className="sidebar__lists__content scrollbar">
                            {lists.length > 0 ? (
                                lists.map((list) => (
                                    <div
                                        key={list.listId}
                                        onClick={() => {
                                            showList(list.listId);
                                        }}
                                        className={`listNavItem ${
                                            isListActive(list.listId)
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <div>{list.title}</div>
                                        <i
                                            className="pi pi-trash deleteButton"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                confirmDelete(list);
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="sidebar__lists__content__empty">
                                    No list found
                                </div>
                            )}
                        </div>
                    )}
                    <div className="sidebar__lists__footer">
                        <Button
                            icon="pi pi-plus"
                            label="Add list"
                            onClick={() => toggleCreateMode(!isCreateModeOpen)}
                            className={`w-full ${
                                lists.length === 0 ? "p-button-outlined" : ""
                            }`}
                        />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default connector(Component);
