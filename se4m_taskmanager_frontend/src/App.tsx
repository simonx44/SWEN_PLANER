import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import AuthPage from "routes/AuthPage";
import { AUTHSERVICE_INSTANCE } from "services/authService";
import { Sidebar } from "primereact/sidebar";
import { Route, Routes } from "react-router-dom";
import TheSideBar from "./components/navigation/TheSideBar";
import TheHeaderBar from "./components/navigation/TheHeaderBar";
import ResponsiveConstants from "./constants/ResponsiveConstants";
import "./App.scss";
import routes from "./routes/ApplicationRoutes";
import { ToastProvider } from "./context/ToastContext";
import GlobalUI from "./components/global/GlobalUI";
import AppInitalizer from "./AppInitalizer";

const App: React.FC = () => {
    const [displaySideBar, toggleSideBar] = useState(true);
    const [displayMobileSideBar, toggleMobileSidbar] = useState(false);
    const isUserLoggedIn = useSelector(
        (state: RootState) => state.user.user.isUserLoggedIn
    );
    const handleSideBar = () => {
        const windowWidth = window.innerWidth;
        if (windowWidth > ResponsiveConstants.MOBILE_WIDTH) {
            toggleSideBar(!displaySideBar);
        } else {
            toggleMobileSidbar(!displayMobileSideBar);
        }
    };

    const handleWindowResize = () => {
        const windowWidth = window.innerWidth;
        if (windowWidth < ResponsiveConstants.MOBILE_WIDTH) {
            toggleSideBar(false);
        } else {
            toggleSideBar(true);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        handleWindowResize();
        AUTHSERVICE_INSTANCE.initializeSession();
    }, []);

    return (
        <ToastProvider>
            <TheHeaderBar toggleSideBar={handleSideBar} />

            {!isUserLoggedIn ? (
                <AuthPage />
            ) : (
                <>
                    <AppInitalizer />

                    <main className="appContainer">
                        <div
                            className={`${
                                displaySideBar
                                    ? "appContainer__sidebar--active"
                                    : null
                            } appContainer__sidebar md:inline-flex`}
                        >
                            <TheSideBar />
                        </div>

                        <Sidebar
                            className="inline-flex md:hidden h-full"
                            visible={displayMobileSideBar}
                            modal={false}
                            position="left"
                            onHide={() => {
                                toggleMobileSidbar(false);
                            }}
                        >
                            <TheSideBar />
                        </Sidebar>
                        <div
                            className={`${
                                displaySideBar
                                    ? "appContainer__content--active"
                                    : null
                            } appContainer__content`}
                        >
                            <GlobalUI />
                            <Routes>
                                {routes.map((route) => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={<route.component />}
                                    />
                                ))}
                            </Routes>
                        </div>
                    </main>
                </>
            )}
        </ToastProvider>
    );
};

export default App;
