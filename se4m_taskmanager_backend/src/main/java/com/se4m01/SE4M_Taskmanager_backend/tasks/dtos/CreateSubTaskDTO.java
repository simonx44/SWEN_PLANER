package com.se4m01.SE4M_Taskmanager_backend.tasks.dtos;


import com.se4m01.SE4M_Taskmanager_backend.tasks.Subtask;
import com.se4m01.SE4M_Taskmanager_backend.tasks.Task;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
//@AllArgsConstructor
@NoArgsConstructor
public class CreateSubTaskDTO {

    @NotNull(message = "Title should not be null")
    private String subTaskTitle;

    @NotBlank
    private String subTaskDescription;
    //TODO: Implement Validation for Swagger

}
