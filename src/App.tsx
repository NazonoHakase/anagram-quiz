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

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [categories, setCategories] = useState<Category[]>(() => {
    const uniqueNames = Array.from(new Set(initialQuestions.map(q => q.category)));
    return uniqueNames.map((name, i) => ({ id: String(i + 1), name }));
  });

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const backend = isTouchDevice ? TouchBackend : HTML5Backend;
  const backendOptions = isTouchDevice ? { enableMouseEvents: true } : {};

  const filteredQuestions = selectedCategory 
    ? questions.filter(q => q.category === selectedCategory)
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
          {/* Header */}
          <header className="bg-yobel-green text-white p-4 shadow-xl border-b-4 border-yobel-gold/50 relative">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="w-10"></div>

              <Link to="/" onClick={() => setSelectedCategory(null)} className="flex items-center gap-3 group absolute left-1/2 transform -translate-x-1/2">

  <img 
    src="/logo.png"  // ← public/logo.png
    alt="ヨベルの角笛ロゴ"
  className="w-16 md:w-20 h-auto object-contain transform group-hover:rotate-12 transition-transform shadow-md rounded-xl"  // ← h-auto で縦横比維持
/>
                <div className="bg-yobel-gold p-2 rounded-xl transform group-hover:rotate-12 transition-transform shadow-lg">

                  <Music className="text-yobel-green" />
                </div>
                <h1 className="text-xl md:text-3xl font-black tracking-tighter whitespace-nowrap">
                  ヨベルの「並べ替えクイズ」
                </h1>
              </Link>
              
              <div className="flex items-center gap-2 md:gap-4 z-10">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 hover:bg-white/10 rounded-full transition-all"
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
                <Link to="/admin" className="p-2 hover:bg-white/10 rounded-full transition-all" aria-label="Admin">
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
            © 2024 ヨベルのアナグラム並べ替えクイズ. All Rights Reserved.
          </footer>
        </div>
      </Router>
    </DndProvider>
  );
};

export default App;