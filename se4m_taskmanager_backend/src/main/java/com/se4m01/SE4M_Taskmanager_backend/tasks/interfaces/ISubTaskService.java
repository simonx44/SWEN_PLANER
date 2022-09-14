package com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces;

import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.CreateSubTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.ModifySubTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.exceptions.TaskNotDeleteableException;
import com.se4m01.SE4M_Taskmanager_backend.tasks.exceptions.TaskNotFoundException;

import java.util.UUID;

public interface ISubTaskService {


    void createSubTask(CreateSubTaskDTO subTask, UUID userId, UUID parentTaskId) throws TaskNotFoundException;

    void deleteSubTask(UUID subTaskId, UUID userId) throws TaskNotDeleteableException;

    void modifySubTask(UUID subTaskId, UUID userId, ModifySubTaskDTO subTask) throws TaskNotFoundException;
}
