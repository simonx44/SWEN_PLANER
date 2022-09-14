package com.se4m01.SE4M_Taskmanager_backend.tasks.messages;

import java.util.UUID;

public class TaskMessages {

    public static final String CREATE_MESSAGE = "Task was created:";
    public static final String TASK_NOT_FOUND = "Task could not be found:";

    public static final String TASK_NOT_DELETED = "Task could not be deleted";


    public static String getTaskCreatedMessage(UUID id){
        return CREATE_MESSAGE.concat(" ").concat(id.toString());
    }

    public static String getTaskNotFoundMessage(UUID id){
        return TASK_NOT_FOUND.concat(id.toString());
    }
}
