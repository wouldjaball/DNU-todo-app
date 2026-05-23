"use client";

import { useState, useEffect, useCallback } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      setTodos(JSON.parse(stored));
    }
    setMounted(true);
  }, []);

  const persist = useCallback((next: Todo[]) => {
    setTodos(next);
    localStorage.setItem("todos", JSON.stringify(next));
  }, []);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    persist([...todos, { id: crypto.randomUUID(), text: trimmed, completed: false }]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    persist(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: string) => {
    persist(todos.filter((t) => t.id !== id));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">To-Do List</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
          className="flex gap-2 mb-6"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task..."
            data-testid="todo-input"
            className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            data-testid="add-button"
            className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </form>

        {todos.length === 0 && (
          <p className="text-zinc-400 text-center" data-testid="empty-message">
            No tasks yet. Add one above.
          </p>
        )}

        <ul className="space-y-2" data-testid="todo-list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              data-testid="todo-item"
              className="flex items-center gap-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                data-testid="todo-checkbox"
                className="h-4 w-4 accent-blue-600"
              />
              <span
                data-testid="todo-text"
                className={`flex-1 ${todo.completed ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                data-testid="delete-button"
                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
