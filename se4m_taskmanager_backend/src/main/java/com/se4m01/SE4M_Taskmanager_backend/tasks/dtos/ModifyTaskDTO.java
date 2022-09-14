package com.se4m01.SE4M_Taskmanager_backend.tasks.dtos;

import com.se4m01.SE4M_Taskmanager_backend.tasks.Task;
import com.se4m01.SE4M_Taskmanager_backend.tasks.TaskState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
//@AllArgsConstructor
public class ModifyTaskDTO {

    @NotNull
    private Task.TaskPriority priority;


    @NotNull(message = "Title should not be null")
    private String taskTitle;

    @NotBlank
    private String taskDescription;

    private Date dueDay;

    @Min(1)
    private float plannedEffort;

    private TaskState status;

}
