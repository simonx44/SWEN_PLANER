package com.se4m01.SE4M_Taskmanager_backend;


import com.se4m01.SE4M_Taskmanager_backend.tasks.exceptions.TaskNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApplicationExceptionHandler {


    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleInvalidArgument(MethodArgumentNotValidException ex) {
        Map<String, String> errorMap = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errorMap.put(error.getField(), error.getDefaultMessage());
        });
        return errorMap;
    }


    // ALL unhandle exceptions // JUST provide error message -> not whole trace
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(Exception.class)
    public Map<String, Object> handleGenericException(Exception ex) {
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("message", ex.getLocalizedMessage());
        errorMap.put("timestamp", new Date());
        return errorMap;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(TaskNotFoundException.class)
    public Map<String, Object> handleResourceNotFound(Exception ex) {
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("message", ex.getMessage());
        errorMap.put("type", ex.getClass().toString());
        return errorMap;
    }


}