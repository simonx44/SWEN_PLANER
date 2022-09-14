import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { AUTHSERVICE_INSTANCE } from "services/authService";
import "./Navigation.scss";

type FunctionProperties = {
    toggleSideBar: () => void;
};

const TheHeaderBar: React.FC<FunctionProperties> = ({ toggleSideBar }) => {
    const isUserLoggedIn = useSelector(
        (state: RootState) => state.user.user.isUserLoggedIn
    );
    const logout = () => {
        AUTHSERVICE_INSTANCE.signOutUser();
    };
    return (
        <header className="topbar">
            <div className="topbar__brand">
                <div className="topbar__brand__icon">
                    <i className="pi pi-calendar" />
                </div>
                <div className="topbar__brand__name">TASK PLANER</div>
                <div className="topbar__brand__toggle" onClick={toggleSideBar}>
                    <i className="pi pi-align-justify" />
                </div>
            </div>
            <div className="topbar__toolbox">
                <i className="pi pi-user icon" />
                <i className="pi pi-cog icon" />
                {isUserLoggedIn && (
                    <i className="pi pi-power-off" onClick={logout} />
                )}
            </div>
        </header>
    );
};

export default TheHeaderBar;
