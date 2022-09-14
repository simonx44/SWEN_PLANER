/* eslint-disable max-classes-per-file */
export default class Messages {
    static ListService = class {
        static ListExceptionMessages = class {
            static readonly LISTS_NOT_FOUND = "Lists couldnt be found";

            static readonly LISTS_NOT_DELETEABLE = "Lists couldnt be found";

            static readonly LISTS_COULD_NOT_BE_CREATED = "List couldnt be created";

            static readonly LISTS_COULD_NOT_BE_MODIFIED = "List couldnt be updated";
        };

        static ListSuccessMessages = class {
            static readonly LIST_CREATED = "List succesfully created";

            static readonly LIST_DELETED = "List succesfully deleted";

            static readonly LIST_UPDATED = "List succesfully updated";
        };
    };

    static TaskService = class {
        static TaskExceptionMessages = class {
            static readonly TASKS_NOT_FOUND = "Tasks couldnt be found";

            static readonly TASK_COULD_NOT_CREATED = "Tasks couldnt be created";

            static readonly TASK_COULD_NOT_BE_UPDATED = "Task updated failed";

            static readonly TASK_COULD_NOT_DELETED = "Task could not be deleted";

            static readonly SUBTASK_COULD_NOT_CREATED = "Subtask could not be deleted";
        };

        static TaskSuccessMessages = class {
            static readonly TASK_CREATED = "Task succesfully created";

            static readonly TASK_DELETED = "Task succesfully deleted";

            static readonly TASKS_FOUND = "Task successfully found";

            static readonly TASK_STATE_UPDATED = "Task successfully updated";

            static readonly SUBTASK_DELETED = "Subtask was deleted";
        };
    };

    static UserService = class {
        static ExceptionMessages = class {
            static readonly LOGIN_FAILED = "Login failed. Try again!";

            static readonly REGISTER_FAILED = "Sign up failed. Try again!";
        };

        static SuccessMessages = class {
            static readonly USER_LOGGED_IN = "User succesfully logged in";

            static readonly USER_SIGNED_UP = "User succesfully signed up";
        };
    };
}
