package com.se4m01.SE4M_Taskmanager_backend.tasks;

import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.CreateSubTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.CreateTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.ModifyTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.exceptions.TaskNotDeleteableException;
import com.se4m01.SE4M_Taskmanager_backend.tasks.exceptions.TaskNotFoundException;
import com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces.ISubTaskService;
import com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces.ITaskRepository;
import com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces.ITaskService;
import com.se4m01.SE4M_Taskmanager_backend.tasks.messages.TaskMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskService implements ITaskService {

    @Autowired
    ITaskRepository taskRepository;

    @Override
    public Task getTaskById(UUID taskId, UUID userId) throws TaskNotFoundException {


        Optional<Task> task = taskRepository.findTaskByTaskIdAndAndAssignedUser(taskId, userId);

        if (task.isPresent()) {
            return task.get();
        } else {
            throw new TaskNotFoundException(TaskMessages.getTaskNotFoundMessage(taskId));
        }


    }

    @Override
    public List<Task> getAllTasks(UUID userId) {

        return taskRepository.findTasksByAssignedUser(userId);

    }

    @Override
    public void deleteTaskById(UUID taskId, UUID userId) throws TaskNotDeleteableException {

        try {
            taskRepository.deleteTaskByTaskIdAndAssignedUser(taskId, userId);


        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            throw new TaskNotDeleteableException(TaskMessages.TASK_NOT_DELETED);
        }

    }

    @Override
    public Task createTask(CreateTaskDTO task, UUID userId) {

        Task taskToCreate = new Task(task.getPriority(), userId, task.getTaskTitle(),
                task.getTaskDescription(), task.getDueDay(), task.getPlannedEffort(), TaskState.OPEN);

        taskRepository.save(taskToCreate);

        return taskToCreate;

    }

    @Override
    public void modifyTask(Task existingTask, ModifyTaskDTO taskToUpdate) {

        System.out.println("TEST:");

        System.out.println(taskToUpdate.getStatus());

        taskRepository.modifyTask(existingTask.getTaskId(), taskToUpdate.getPriority(),
                taskToUpdate.getTaskTitle(), taskToUpdate.getTaskDescription(),
                taskToUpdate.getDueDay(), taskToUpdate.getPlannedEffort(), taskToUpdate.getStatus());
    }


}
