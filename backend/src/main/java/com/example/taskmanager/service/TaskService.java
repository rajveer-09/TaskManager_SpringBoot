package com.example.taskmanager.service;

import com.example.taskmanager.model.Task;
// import com.example.taskmanager.model.TaskStatus; (Deleted)
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Task> getAllTasks() {
        return taskRepository.findByUserId(getCurrentUser().getId());
    }

    public Task createTask(Task task) {
        task.setUser(getCurrentUser());
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Ensure user owns the task
        if (!task.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Not authorized");
        }

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setDueDate(taskDetails.getDueDate());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        // Ensure user owns the task
        if (!task.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Not authorized");
        }
        taskRepository.delete(task);
    }
}
