import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category } from '../types';

interface HomePageProps {
  categories: Category[];
  onSelectCategory: (category: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ categories, onSelectCategory }) => {
  const navigate = useNavigate();

  const handleSelect = (category: string) => {
    onSelectCategory(category);
    navigate('/quiz');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <h2 className="text-3xl md:text-5xl font-black mb-4 text-yobel-green">
        カテゴリを選んでスタート！
      </h2>
      <p className="text-xl md:text-2xl mb-12 font-bold text-yobel-green/70">
        ～聖書の言葉をアナグラムで解き明かせ～
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.name)}
            className={`
              relative overflow-hidden
              bg-gradient-to-br from-amber-50/80 to-yellow-50/60
              backdrop-blur-sm
              border-4 border-yobel-green/30
              hover:border-yobel-gold/70
              text-yobel-green font-black text-2xl
              hover:bg-gradient-to-br hover:from-amber-100 hover:to-yellow-100
              hover:text-amber-900
              active:bg-gradient-to-br active:from-amber-300 active:to-amber-400
              active:text-amber-950
              transition-all duration-300 ease-out
              p-8 rounded-2xl cursor-pointer shadow-lg
              group
            `}
          >
            <span className="relative z-10 block transform group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
              {cat.name}
            </span>

            {/* ホバー時の光沢オーバーレイ */}
            <div 
              className="
                absolute inset-0 
                bg-gradient-to-t from-transparent via-white/10 to-transparent 
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-500
              " 
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;