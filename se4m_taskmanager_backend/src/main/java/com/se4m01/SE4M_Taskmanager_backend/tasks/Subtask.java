package com.se4m01.SE4M_Taskmanager_backend.tasks;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "Subtask")
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Subtask implements Serializable {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-char")
    @Column(name = "id", updatable = false )
    private UUID subtaskId;

    @Column(
            name = "subtaskTitle",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String subtaskTitle;

    @Column(
            name = "subtaskDescription",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String subtaskDescription;

    @ManyToOne
    @JoinColumn(name="task_fk")
    @JsonBackReference
    private Task task;

    @Column(
            name = "status",
            nullable = false
    )
    @Enumerated(EnumType.ORDINAL)
    private TaskState state;


    public Subtask(String subtaskTitle, String subtaskDescription, Task task, TaskState status) {
        this.subtaskTitle = subtaskTitle;
        this.subtaskDescription = subtaskDescription;
        this.task = task;
        this.state = status;
    }
}
