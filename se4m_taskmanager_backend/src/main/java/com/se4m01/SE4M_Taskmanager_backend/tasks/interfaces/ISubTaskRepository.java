package com.se4m01.SE4M_Taskmanager_backend.tasks.interfaces;

import com.se4m01.SE4M_Taskmanager_backend.tasks.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.UUID;

@Repository
public interface ISubTaskRepository extends JpaRepository<Subtask, UUID> {

}
