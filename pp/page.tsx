"use client";

import { useState } from "react";
import { useEffect, useRef } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<Todo['priority']>('medium');
  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addTodo = () => {
    if (input.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        dueDate: newTodoDueDate || undefined,
        priority: newTodoPriority,
      };
      setTodos([...todos, newTodo]);
      setInput("");
      setNewTodoDueDate('');
      setNewTodoPriority('medium');
      setShowAdvanced(false);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const removeTodo = (id: number) => {
    const todoToRemove = todos.find(t => t.id === id);
    if (todoToRemove) {
      setDeletedTodo(todoToRemove);
      setShowUndoToast(true);
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
      undoTimeoutRef.current = setTimeout(() => {
        setTodos(todos.filter(todo => todo.id !== id));
        setShowUndoToast(false);
        setDeletedTodo(null);
      }, 3000);
    }
  };

  const undo = () => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
    if (deletedTodo) {
      setTodos([...todos, deletedTodo]);
    }
    setShowUndoToast(false);
    setDeletedTodo(null);
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Todo List</h1>
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex gap-2">
            <input
              ref={inputRef}
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
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition"
            >
              {showAdvanced ? 'Hide' : 'Advanced'}
            </button>
          </div>
          {showAdvanced && (
            <div className="flex gap-2">
              <input
                type="date"
                value={newTodoDueDate}
                onChange={(e) => setNewTodoDueDate(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <select
                value={newTodoPriority}
                onChange={(e) => setNewTodoPriority(e.target.value as Todo['priority'])}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-3 py-1 rounded-lg ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 px-3 py-1 rounded-lg ${filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 px-3 py-1 rounded-lg ${filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Completed
          </button>
        </div>
        <ul className="space-y-3">
          {filteredTodos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <div className="flex flex-col">
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
                <div className="flex gap-2 mt-1">
                  {todo.dueDate && (
                    <span className="text-xs text-gray-500">
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
                    {todo.priority}
                  </span>
                </div>
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
        {filteredTodos.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No tasks yet. Add one above!</p>
        )}
        {showUndoToast && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <span>Task deleted</span>
            <button onClick={undo} className="underline">Undo</button>
          </div>
        )}
      </div>
    </main>
  );
