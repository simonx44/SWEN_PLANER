package com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces;

import com.se4m01.SE4M_Taskmanager_backend.tasks.Task;
import com.se4m01.SE4M_Taskmanager_backend.tasks.TaskState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ITaskRepository extends JpaRepository<Task, UUID> {

    Optional<Task> findTaskByTaskIdAndAndAssignedUser(UUID taskId, UUID userId);

    List<Task> findTasksByAssignedUser(UUID userid);
    @Transactional
    void deleteTaskByTaskIdAndAssignedUser(UUID taskId, UUID userId);


    @Transactional
    @Modifying
    @Query("Update Task t set t.dueDay = :dueDay, t.plannedEffort = :plannedEffort," +
            "t.priority = :priority, t.taskTitle = :taskTitle, t.state = :status, t.taskDescription = :taskDescription " +
            "where t.taskId = :existingTaskId")
    void modifyTask(UUID existingTaskId, Task.TaskPriority priority, String taskTitle,
                    String taskDescription, Date dueDay, float plannedEffort, TaskState status);

}
