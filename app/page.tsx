'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AddTodoForm } from '@/components/AddTodoForm';
import { TodoList, Todo } from '@/components/TodoList';
import { Color } from '@/components/DatePicker';

export default function Home() {
  const [todos, setTodos, isLoaded] = useLocalStorage<Todo[]>('todos', []);

  const addTodo = (text: string, color: Color, dueDate?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
      color,
      dueDate,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const editTodo = (id: string, text: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateColor = (id: string, color: Color) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, color } : todo
    ));
  };

  const updateDueDate = (id: string, dueDate: string | undefined) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, dueDate } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Todo List
          </h1>
          <p className="text-gray-600">
            Organize your tasks with colors and due dates
          </p>
        </header>

        {!isLoaded ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <AddTodoForm onAdd={addTodo} />

            <div className="mt-8">
              <TodoList
                todos={todos}
                onToggle={toggleTodo}
                onEdit={editTodo}
                onDelete={deleteTodo}
                onColorChange={updateColor}
                onDueDateChange={updateDueDate}
                onClearCompleted={clearCompleted}
              />
            </div>
          </>
        )}

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Data stored locally in your browser</p>
        </footer>
      </div>
    </div>
  );
}
