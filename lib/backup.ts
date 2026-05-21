import { Todo } from '@/components/TodoList';

export function exportTodos(todos: Todo[]) {
  const data = JSON.stringify(todos, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `todos-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importTodos(file: File): Promise<Todo[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const todos = JSON.parse(e.target?.result as string);
        if (Array.isArray(todos)) {
          resolve(todos);
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (err) {
        reject(new Error('Failed to parse JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function downloadTodosAsText(todos: Todo[]) {
  const text = todos
    .map((todo) => {
      const status = todo.completed ? '[x]' : '[ ]';
      const date = todo.dueDate ? ` 📅 ${todo.dueDate}` : '';
      const color = todo.color ? ` ${todo.color.name}` : '';
      return `${status} ${todo.text}${color}${date}`;
    })
    .join('\n');

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `todos-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
