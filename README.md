# Todo List

A clean, Apple-inspired todo list application built with Next.js 15, TypeScript, and Tailwind CSS.

![Todo List App](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

- ✅ Add, edit, and delete todos
- 🎨 Custom color picker with color naming
- 📅 Due dates with relative time display
- 🔍 Filter by All/Active/Completed
- 💾 Local storage persistence (no backend required)
- 🌙 Dark mode support
- 📊 Sort by due date, created date, or color
- 📤 Export/Import data as JSON
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser localStorage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/anamoulrouf/todolist.git
cd todolist

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Adding a Todo

1. Type your task in the input field at the top
2. Select a color (optional)
3. Set a due date (optional)
4. Press Enter or Cmd+Enter to add

### Managing Todos

- **Complete**: Click the circle checkbox
- **Edit**: Double-click the todo text or click the edit icon
- **Delete**: Click the trash icon
- **Change Color**: Click the color icon to select a new color
- **Set Due Date**: Click the calendar icon

### Filtering

Use the segmented control to filter:
- All - Show all todos
- Active - Show incomplete todos
- Completed - Show completed todos

### Sorting

Sort todos by:
- Due date (ascending/descending)
- Created date (newest/oldest first)
- Color

### Dark Mode

Toggle dark mode using the sun/moon icon in the header. Your preference is saved automatically.

### Export/Import

**Export**: Click the download icon to save your todos as a JSON file.

**Import**: Click the upload icon to restore todos from a JSON backup.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter | Add new todo (when in input field) |
| Cmd+Enter | Add new todo (when in input field) |
| Esc | Cancel editing |

## Project Structure

```
todolist/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/
│   ├── AddTodoForm.tsx    # Add todo input
│   ├── ColorPicker.tsx    # Color selection
│   ├── DatePicker.tsx     # Date picker
│   ├── TodoItem.tsx       # Individual todo
│   └── TodoList.tsx       # Todo list container
├── hooks/
│   └── useLocalStorage.ts # localStorage hook
└── lib/
    └── backup.ts          # Export/import functions
```

## Deployment

This project is designed to be deployed on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click "Deploy"

Vercel will automatically detect it's a Next.js project and configure everything.

## Data Storage

All data is stored locally in your browser using localStorage. This means:
- ✅ No server required
- ✅ Fast, instant updates
- ✅ Privacy (data never leaves your device)
- ⚠️ Data is device-specific
- ⚠️ Clearing browser data will delete your todos

**Tip**: Use the Export feature regularly to backup your todos!

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/).

---

**GitHub**: [https://github.com/anamoulrouf/todolist](https://github.com/anamoulrouf/todolist)

## Changelog

### v1.0.0 (May 2024)
- Initial release
- Add, edit, delete todos
- Custom colors with naming
- Due dates with relative time
- Filter by All/Active/Completed
- localStorage persistence
- Accessibility improvements (input color contrast)
