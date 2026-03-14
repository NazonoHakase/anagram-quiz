import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import AdminPage from './pages/AdminPage';
import { initialQuestions } from './data/questions';
import type { Question, Category } from './types';
import { Music, Sun, Moon, Settings } from 'lucide-react';

const AppContent = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [categories, setCategories] = useState<Category[]>(() => {
    const uniqueNames = Array.from(new Set(initialQuestions.map(q => q.category)));
    return uniqueNames.map((name, i) => ({ id: String(i + 1), name }));
  });

  const navigate = useNavigate();

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const backend = isTouchDevice ? TouchBackend : HTML5Backend;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="bg-yobel-green text-white p-4 shadow-xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" onClick={() => setSelectedCategory(null)}>
            <h1 className="text-2xl font-black">ヨベルの「並べ替えクイズ」</h1>
          </Link>
          <div className="flex gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun /> : <Moon />}
            </button>
            <Link to="/admin"><Settings /></Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage categories={categories} onSelectCategory={setSelectedCategory} />} />
          <Route path="/quiz" element={<QuizPage questions={questions.filter(q => q.category === selectedCategory)} onFinish={() => navigate('/')} onRestart={() => { setSelectedCategory(null); navigate('/'); }} />} />
          <Route path="/admin" element={<AdminPage questions={questions} onUpdateQuestions={setQuestions} categories={categories} onUpdateCategories={setCategories} />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <AppContent />
      </Router>
    </DndProvider>
  );
};

export default App;