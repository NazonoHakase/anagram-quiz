import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import type { Question, Category } from './types';
import { initialQuestions } from './data/questions';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import AdminPage from './pages/AdminPage';
import { Music, Sun, Moon, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [categories, setCategories] = useState<Category[]>(() => {
    const uniqueNames = Array.from(new Set(initialQuestions.map(q => q.category)));
    return uniqueNames.map((name, i) => ({ id: String(i + 1), name }));
  });

  // Check if it's a touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const backend = isTouchDevice ? TouchBackend : HTML5Backend;
  const backendOptions = isTouchDevice ? { enableMouseEvents: true } : {};

  // Helper to extract sorting order from problemText (e.g., "1 ", "2.", etc.)
  const extractOrder = (text: string): number => {
    const match = text.trim().match(/^(\d+|\uff11|\uff12|\uff13|\uff14|\uff15|\uff16|\uff17|\uff18|\uff19|\uff10)+/);
    if (!match) return 999999;
    // Handle both half-width and full-width numbers
    const numStr = match[0].replace(/[\uff10-\uff19]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
    return parseInt(numStr, 10);
  };

  const filteredQuestions = selectedCategory 
    ? questions
        .filter(q => q.category === selectedCategory)
        .sort((a, b) => extractOrder(a.problemText) - extractOrder(b.problemText))
    : [];

  const handleFinish = () => {
    alert('全問正解！おめでとうございます！');
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <DndProvider backend={backend} options={backendOptions}>
      <Router>
        <div className="min-h-screen flex flex-col transition-colors duration-300 overflow-x-hidden">
          {/* Main Navigation */}
          <header className="bg-yobel-green text-white p-4 shadow-xl border-b-4 border-yobel-gold/50 relative">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              {/* Left side (hidden on small screens to maintain center, or just for spacing) */}
              <div className="w-10"></div>

              {/* Centered Title */}
              <Link to="/" onClick={() => setSelectedCategory(null)} className="flex items-center gap-3 group absolute left-1/2 transform -translate-x-1/2">
                <div className="bg-yobel-gold p-2 rounded-xl transform group-hover:rotate-12 transition-transform shadow-lg">
                  <Music className="text-yobel-green" />
                </div>
                <h1 className="text-xl md:text-3xl font-black tracking-tighter whitespace-nowrap">
                  ヨベルの「並べ替えクイズ」
                </h1>
              </Link>
              
              {/* Right side icons */}
              <div className="flex items-center gap-2 md:gap-4 z-10">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 hover:bg-white/10 rounded-full transition-all"
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
                <Link to="/admin" className="p-2 hover:bg-white/10 rounded-full transition-all" aria-label="Settings">
                  <Settings size={24} />
                </Link>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-grow py-8 px-4 relative max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={
                selectedCategory ? (
                  <QuizPage 
                    questions={filteredQuestions} 
                    onFinish={handleFinish}
                    onRestart={() => setSelectedCategory(null)}
                  />
                ) : (
                  <HomePage categories={categories} onSelectCategory={setSelectedCategory} />
                )
              } />
              <Route path="/admin" element={
                <AdminPage 
                  questions={questions} 
                  onUpdateQuestions={setQuestions} 
                  categories={categories}
                  onUpdateCategories={setCategories}
                />
              } />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="p-8 text-center border-t-2 border-yobel-green/10 text-yobel-green/40 font-black">
            &copy; 2024 ヨベルのアナグラム並べ替えクイズ. All Rights Reserved.
          </footer>
        </div>
      </Router>
    </DndProvider>
  );
};

export default App;
