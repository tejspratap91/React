# React Component Hub 🚀

A comprehensive React project showcasing 6 fully-functional components demonstrating core React concepts and best practices.

## 📋 Project Overview

This project includes six interactive components:

1. **Todo List** ✓
   - Add, complete, and delete todos
   - Filter by status (All, Active, Completed)
   - Statistics display (Total, Active, Completed)
   - LocalStorage persistence

2. **Weather Report** 🌤️
   - Search weather by city
   - Real-time weather data using Open-Meteo API
   - Display temperature, humidity, wind speed, pressure
   - Beautiful gradient cards with weather icons

3. **Notepad** 📝
   - Create, edit, and delete notes
   - Search functionality
   - Auto-save to LocalStorage
   - Note timestamps and word count

4. **Calculator** 🧮
   - Basic arithmetic operations (+, -, *, /, %)
   - Calculation history
   - Clear history feature
   - Responsive button grid

5. **Timer & Stopwatch** ⏱️
   - Switch between Timer and Stopwatch modes
   - Start, pause, reset functionality
   - Lap recording for stopwatch
   - Sound notification when timer ends

6. **Budget Manager** 💰
   - Track income and expenses
   - Categorize transactions
   - View balance and statistics
   - Expense breakdown with percentage
   - LocalStorage persistence

## 🎯 Core React Concepts Demonstrated

### Hooks Used
- **useState**: Managing component state (todos, notes, calculator state, etc.)
- **useEffect**: Side effects (localStorage, API calls, intervals)
- **useRef**: Managing intervals and DOM references
- **useMemo**: Performance optimization for calculations

### Best Practices
- ✅ Component composition and reusability
- ✅ Separation of concerns (components, styles, logic)
- ✅ TypeScript for type safety
- ✅ Proper error handling
- ✅ LocalStorage for data persistence
- ✅ API integration (Axios for weather data)
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ Clean code and naming conventions

## 📁 Project Structure

```
React-demo/
├── src/
│   ├── components/
│   │   ├── TodoList.tsx
│   │   ├── WeatherReport.tsx
│   │   ├── Notepad.tsx
│   │   ├── Calculator.tsx
│   │   ├── Timer.tsx
│   │   └── BudgetManager.tsx
│   ├── hooks/
│   │   └── useLocalStorage.ts (Custom hook for localStorage)
│   ├── utils/
│   │   └── localStorage.ts (Common localStorage utilities)
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── TodoList.css
│   │   ├── WeatherReport.css
│   │   ├── Notepad.css
│   │   ├── Calculator.css
│   │   ├── Timer.css
│   │   └── BudgetManager.css
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── README.md
└── LOCALSTORAGE_GUIDE.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd React-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 🛠️ Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build
- **`npm run lint`** - Run linting

## 🎨 Styling Approach

- **CSS Variables**: Custom properties for consistent theming
- **CSS Grid & Flexbox**: Responsive layouts
- **CSS Gradients**: Modern visual effects
- **Mobile-First**: Responsive design for all screen sizes
- **Smooth Transitions**: Professional animation effects

## 📦 Dependencies

### Main Dependencies
- **react**: UI library
- **react-dom**: React rendering
- **axios**: HTTP client for API requests

### Dev Dependencies
- **typescript**: Type safety
- **vite**: Build tool and dev server
- **@vitejs/plugin-react**: React support for Vite

## 🌟 Key Features

### Type Safety
All components are written in TypeScript with proper interface definitions and type annotations.

### State Management
- Local component state with `useState`
- Derived state with `useMemo`
- Side effects management with `useEffect`

### Data Persistence with localStorage
- **Custom Hook**: `useLocalStorage<T>()` - Reusable hook for all components
- **Utility Functions**: Common localStorage operations in `src/utils/localStorage.ts`
- **Automatic Sync**: Data persists automatically across browser sessions
- **Type-Safe**: Full TypeScript support with generics

#### Components Using localStorage
- **Todo List** - Persists all todos, filters, and completion status
- **Notepad** - Saves all notes with timestamps
- **Budget Manager** - Stores all transactions and categories

See [LOCALSTORAGE_GUIDE.md](LOCALSTORAGE_GUIDE.md) for detailed documentation.

### API Integration
- Open-Meteo API for free weather data
- No authentication required
- Proper error handling

### UI/UX
- Intuitive navigation between components
- Clear visual feedback for interactions
- Loading states and error messages
- Responsive design

## 💡 Learning Resources

This project demonstrates:

1. **Component Lifecycle** - Understanding mounting, updating, and cleanup
2. **State and Props** - Managing data flow in React
3. **Hooks** - Modern React function components
4. **Event Handling** - User interactions
5. **Conditional Rendering** - Dynamic UI updates
6. **List Rendering** - Working with arrays
7. **Form Handling** - Input management
8. **Local Storage** - Client-side data persistence
9. **API Integration** - External data fetching
10. **Performance** - Optimization techniques

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use, you can change it in `vite.config.ts`:

```typescript
server: {
  port: 3000, // Change to a different port
}
```

### Weather API Issues
If weather data fails to load, check your internet connection. The app uses the free Open-Meteo API which doesn't require authentication.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and add more components or features!

## 📞 Support

For issues or questions, please check the code comments or refer to the React documentation at https://react.dev

---

**Happy Coding!** 🎉
