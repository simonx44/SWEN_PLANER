package com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces;

import com.se4m01.SE4M_Taskmanager_backend.tasks.Task;
import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.CreateSubTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.CreateTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.ModifyTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.exceptions.TaskNotDeleteableException;
import com.se4m01.SE4M_Taskmanager_backend.tasks.exceptions.TaskNotFoundException;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ITaskService {
    Task getTaskById(UUID taskId, UUID userId) throws TaskNotFoundException;

    List<Task> getAllTasks(UUID userId);

    void deleteTaskById(UUID taskId, UUID userId)  throws TaskNotDeleteableException;

    Task createTask(CreateTaskDTO task, UUID userId);

    void modifyTask (Task existingTask, ModifyTaskDTO taskToUpdate);

}
