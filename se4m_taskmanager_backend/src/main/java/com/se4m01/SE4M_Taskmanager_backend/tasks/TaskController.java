package com.se4m01.SE4M_Taskmanager_backend.tasks;

import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.CreateSubTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.CreateTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.ModifySubTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.dtos.ModifyTaskDTO;
import com.se4m01.SE4M_Taskmanager_backend.tasks.exceptions.TaskNotDeleteableException;
import com.se4m01.SE4M_Taskmanager_backend.tasks.exceptions.TaskNotFoundException;
import com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces.ISubTaskService;
import com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces.ITaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import javax.validation.Valid;
import java.util.*;

@RestController
@RequestMapping(value = "/tasks")
public class TaskController {

    private final UUID userId = UUID.fromString("133e253d-2086-416b-afd1-3e8abf305636");

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    ITaskService taskService;
    @Autowired
    ISubTaskService subTaskService;


    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody @Valid CreateTaskDTO task) {

        Task createdTask = taskService.createTask(task, userId);

        return new ResponseEntity<Task>(createdTask, HttpStatus.ACCEPTED);
    };

    @PatchMapping("/{id}")
    public ResponseEntity<Object> modifyTask(@PathVariable("id") UUID id, @RequestBody @Valid ModifyTaskDTO task) {

        // Refactor: -> gehört nicht in den Controller, sondern in den Service
        // Status hinzufügen

        Task existingTask;
        try {
            existingTask = taskService.getTaskById(id,userId);
        } catch (TaskNotFoundException e) {
            return new ResponseEntity<Object>(null, HttpStatus.NO_CONTENT);
        }

        taskService.modifyTask(existingTask, task);

        //TODO
        return new ResponseEntity<Object>(null, HttpStatus.NO_CONTENT);
    };


    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        logger.info("Getting All tasks ...... ::");
        List<Task> tasks = tasks = taskService.getAllTasks(userId);
        return new ResponseEntity<List<Task>>(tasks, HttpStatus.OK);
    };

    @GetMapping("/{id}")
    public ResponseEntity<Object> getTaskByID(@PathVariable("id") UUID id) throws TaskNotFoundException {

        logger.info("Getting Single ...... ::");
        Task task = task = taskService.getTaskById(id,userId);

        return new ResponseEntity<Object>(task, HttpStatus.OK);
    };

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTask(@PathVariable UUID id) throws TaskNotDeleteableException {

        logger.info("Delete task with id: "+id.toString());
        taskService.deleteTaskById(id,userId);
        Map response = new HashMap<String, String>();
        response.put("status", "Deleted");
        response.put("resource", id.toString());
        return new ResponseEntity<Object>(response, HttpStatus.ACCEPTED);
    };


    @PostMapping("/{id}/subtasks")
    public ResponseEntity<Object> createSubTask(@PathVariable("id") UUID id,@RequestBody @Valid CreateSubTaskDTO subTaskDTO) throws TaskNotFoundException {
        subTaskService.createSubTask(subTaskDTO,userId, id);

        return new ResponseEntity<Object>(null, HttpStatus.NO_CONTENT);
    };

    @PatchMapping("/{id}/subtasks/{subTaskId}")
    public ResponseEntity<Object> modifySubTask(@PathVariable("id")UUID id, @PathVariable("subTaskId") UUID subTaskId,@RequestBody @Valid ModifySubTaskDTO subTaskDTO) throws TaskNotFoundException {
            subTaskService.modifySubTask(subTaskId, userId, subTaskDTO);

            return new ResponseEntity<Object>(null, HttpStatus.NO_CONTENT);
        };


        @DeleteMapping("/{id}/subtasks/{subTaskId}")
    public ResponseEntity<Object> deleteSubTask(@PathVariable("id")UUID id, @PathVariable("subTaskId") UUID subTaskId) throws TaskNotDeleteableException {

        subTaskService.deleteSubTask(subTaskId,userId);
        Map response = new HashMap<String, String>();
        response.put("status", "Deleted");
        response.put("resource", id.toString());

        return new ResponseEntity<Object>(null, HttpStatus.NO_CONTENT);
    };


}
