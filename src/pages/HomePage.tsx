import React from 'react';
import type { Category } from '../types';

interface HomePageProps {
  categories: Category[];
  onSelectCategory: (category: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ categories, onSelectCategory }) => {

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
            onClick={() => onSelectCategory(cat.name)}
            className="bg-white/80 hover:bg-yobel-gold hover:text-white transition-all p-8 rounded-2xl cursor-pointer card-shadow border-4 border-yobel-green/10 hover:border-yobel-gold/50 text-2xl font-black group"
          >
            <span className="block transform group-hover:scale-110 transition-transform">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
