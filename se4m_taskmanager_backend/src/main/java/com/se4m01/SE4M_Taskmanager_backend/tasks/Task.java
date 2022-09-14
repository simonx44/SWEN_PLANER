package com.se4m01.SE4M_Taskmanager_backend.tasks;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "Task")
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Task implements Serializable {

    public enum TaskPriority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-char")
    @Column(name = "id", updatable = false)
    private UUID taskId;

    @Column(
            name = "priority",
            nullable = true
    )
    @Enumerated(EnumType.ORDINAL)
    private TaskPriority priority;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    @Column(nullable = true)
    @JsonManagedReference
    private List<Subtask> subTaskList = new ArrayList<>();

    @Column(
            name = "assignedUser",
            nullable = false
    )
    @Type(type = "uuid-char")
    private UUID assignedUser;
    @Column(
            name = "taskTitle",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String taskTitle;
    @Column(
            name = "taskDescription",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String taskDescription;
    @Column(
            name = "Due_Day",
            nullable = false,
            columnDefinition = "DATE"
    )
    private Date dueDay;

    @Column(
            name = "Planned_Effort",
            nullable = false,
            columnDefinition = "INT"
    )
    private float plannedEffort;

    @Column(
            name = "status",
            nullable = false
    )
    @Enumerated(EnumType.ORDINAL)
    private TaskState state;


    public Task(TaskPriority priority, UUID assignedUser, String taskTitle,
                String taskDescription, Date dueDay, float plannedEffort, TaskState state)
    {
        this.priority = priority;
        this.assignedUser = assignedUser;
        this.taskTitle = taskTitle;
        this.taskDescription = taskDescription;
        this.dueDay = dueDay;
        this.plannedEffort = plannedEffort;
        this.state = state;
    }

    public void addSubTask (Subtask subtask){
        subTaskList.add(subtask);
    }
}
