"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);
      setInput("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Todo List</h1>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addTodo}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>
        <ul className="space-y-3">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                    todo.completed ? "bg-green-500 border-green-500" : "border-gray-400 hover:border-indigo-500"
                  }`}
                >
                  {todo.completed && <span className="text-white text-xs">✓</span>}
                </button>
                <span className={`text-gray-700 ${todo.completed ? "line-through text-gray-400" : ""}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-red-500 hover:text-red-700 font-bold text-lg transition"
              >
                −
              </button>
            </li>
          ))}
        </ul>
        {todos.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No tasks yet. Add one above!</p>
        )}
      </div>
    </main>
  );
}