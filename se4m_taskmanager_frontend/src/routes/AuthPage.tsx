import { FC, useState } from "react";
import SignInForm from "components/forms/authentication/SignInForm";
import SignUpForm from "components/forms/authentication/SignUpForm";
import { Card } from "primereact/card";

interface IProps {}

const AuthenticationPage: FC<IProps> = () => {
    const [isSignInMode, toggleMode] = useState(true);

    return (
        <div
            className="grid m-5 justify-content-center align-items-center"
            style={{ height: "95vh" }}
        >
            <div className="col-6">
                <Card className="grid authCard">
                    {isSignInMode ? <SignInForm /> : <SignUpForm />}
                    <div className="flex justify-content-end m-0 p-0">
                        <span
                            className="hover:text-700 text-blue-800 cursor-pointer m-0 mr-2 p-0"
                            onClick={() => toggleMode(!isSignInMode)}
                        >
                            {isSignInMode
                                ? "Sign up instead"
                                : "Log in instead"}
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AuthenticationPage;
