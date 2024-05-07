"use client";

import type { Task } from "./task-list";

import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { api } from "~/trpc/react";
import styles from "./task-item.module.css";

export function TaskItem({ task }: { task: Task }) {
  // TODO: Implement the add task mutation
  const queryClient = useQueryClient();
  const changeTask = api.tasks.changeTask.useMutation({
    onSuccess(data) {
      // write to cache
      // 1. find the key by which the data is identified ion the cache
      const key = getQueryKey(api.tasks.tasks, undefined, "query");
      // 2. read the data in the cache
      const existing = queryClient.getQueryData<Task[]>(key) ?? [];
      // 3. write the new data to the cache
      queryClient.setQueryData(
        key,
        existing.map((item) =>
          item.id === data.id ? data : { ...data, ...item }
        )
      );
    }
  });

  const deleteTask = api.tasks.deleteTask.useMutation({
    onSuccess() {
      // write to cache
      // 1. find the key by which the data is identified ion the cache
      const key = getQueryKey(api.tasks.tasks, undefined, "query");
      // 2. read the data in the cache
      const existing = queryClient.getQueryData<Task[]>(key) ?? [];
      // 3. write the new data to the cache
      queryClient.setQueryData(
        key,
        existing.filter((item) => item.id !== task.id)
      );
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.checkbox}>
        <div className={styles.round}>
          <input
            type="checkbox"
            id={`task-${task.id}`}
            checked={task.completed}
            data-testid={`task-${task.id}`}
            onChange={() => {
              changeTask.mutate({
                id: task.id,
                description: task.description,
                completed: !task.completed
              });
            }}
          />
          <label htmlFor={`task-${task.id}`}></label>
        </div>
      </div>
      <span
        className={styles.title}
        style={task.completed ? { textDecoration: "line-through" } : undefined}
      >
        {task.description}
      </span>
      <div className={styles.actions}>
        <button
          data-testid={`delete-${task.id}`}
          className={styles.deleteButton}
          onClick={() => {
            deleteTask.mutate(task.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
