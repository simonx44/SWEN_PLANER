package com.se4m01.SE4M_Taskmanager_backend.tasks;

import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.CreateSubTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.ModifySubTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.exceptions.TaskNotDeleteableException;
import com.se4m01.SE4M_Taskmanager_backend.tasks.exceptions.TaskNotFoundException;
import com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces.ISubTaskRepository;
import com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces.ISubTaskService;
import com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces.ITaskService;
import com.se4m01.SE4M_Taskmanager_backend.tasks.messages.TaskMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class SubTaskService implements ISubTaskService {

    @Autowired
    private ISubTaskRepository repository;
    @Autowired
    private ITaskService taskService;

    @Override
    public void createSubTask(CreateSubTaskDTO subTask, UUID userId, UUID parentTaskId) throws TaskNotFoundException {

       Task task =  taskService.getTaskById(parentTaskId, userId);

       Subtask subTaskToCreate = new Subtask(subTask.getSubTaskTitle(), subTask.getSubTaskDescription(), task, TaskState.OPEN);

       repository.save(subTaskToCreate);

    }

    @Override
    public void deleteSubTask(UUID subTaskId, UUID userId) throws TaskNotDeleteableException {


        try {

            repository.deleteById(subTaskId);

        } catch (EmptyResultDataAccessException exception){
            throw new TaskNotDeleteableException(TaskMessages.getTaskNotFoundMessage((subTaskId)));

        }

    }

    @Override
    public void modifySubTask(UUID subTaskId, UUID userId, ModifySubTaskDTO subTask) throws TaskNotFoundException {
        Optional<Subtask> subtaskWrapper= repository.findById(subTaskId);
        if (subtaskWrapper.isPresent()) {
            Subtask subtaskToModify = subtaskWrapper.get();
            subtaskToModify.setSubtaskDescription(subTask.getSubTaskDescription());
            subtaskToModify.setSubtaskTitle(subTask.getSubTaskTitle());
            subtaskToModify.setState(subTask.getStatus());
            repository.save(subtaskToModify);
        }
        else {
            throw new TaskNotFoundException(TaskMessages.getTaskNotFoundMessage(subTaskId));
        }
    }






}
