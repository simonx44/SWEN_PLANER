package com.se4m01.SE4M_Taskmanager_backend.tasks.dtos;

import com.se4m01.SE4M_Taskmanager_backend.tasks.Task;
import com.se4m01.SE4M_Taskmanager_backend.tasks.TaskState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@AllArgsConstructor
//@NoArgsConstructor
public class ModifySubTaskDTO {

    //TODO: überlegen, ob wir hier noch einen Status hinzufügen und eine Reihenfolge

    @NotNull(message = "Title should not be null")
    private String subTaskTitle;

    @NotBlank
    private String subTaskDescription;
    //TODO: Implement Validation for Swagger

    @NotNull(message = "parentTask should never be null")

    private TaskState status;


}
