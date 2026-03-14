import React, { useState } from 'react';  // ← useEffect を削除
import { Link } from 'react-router-dom';
import type { Question, Category } from '../types';
import { Plus, Trash2, Edit3, Lock, Unlock, X, Save, FolderTree } from 'lucide-react';

interface AdminPageProps {
  questions: Question[];
  onUpdateQuestions: (questions: Question[]) => void;
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ questions, onUpdateQuestions, categories, onUpdateCategories }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<Question>>({
    category: '',
    problemText: '',
    caption: '',
    comment: '',
    answer: '',
    fixedShuffled: '',
    reading: '',
    hints: ['', '', '']
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'yobel' || localStorage.getItem('yobel_admin') === 'true') {
      setIsAuthenticated(true);
      localStorage.setItem('yobel_admin', 'true');
    } else {
      alert('パスワードが違います');
    }
  };

  const openModal = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setFormData(question);
    } else {
      setEditingQuestion(null);
      setFormData({
        category: categories[0]?.name || '',
        problemText: '',
        caption: '',
        comment: '',
        answer: '',
        fixedShuffled: '',
        reading: '',
        hints: ['', '', '']
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHintChange = (index: number, value: string) => {
    const newHints = [...(formData.hints || ['', '', ''])];
    newHints[index] = value;
    setFormData(prev => ({ ...prev, hints: newHints }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Check if characters match
    const answerChars = (formData.answer || '').split('').sort().join('');
    const shuffledChars = (formData.fixedShuffled || '').split('').sort().join('');
    
    if (answerChars !== shuffledChars) {
      alert(`【エラー】文字セットが一致しません。\n\n正解に必要な文字:\n${answerChars}\n\nバラバラ文字として用意された文字:\n${shuffledChars}\n\nこれらが一致するように修正してください。`);
      return;
    }

    if (editingQuestion) {
      const updated = questions.map(q => q.id === editingQuestion.id ? { ...q, ...formData } as Question : q);
      onUpdateQuestions(updated);
    } else {
      const newQuestion: Question = {
        ...formData,
        id: Math.max(0, ...questions.map(q => q.id)) + 1
      } as Question;
      onUpdateQuestions([...questions, newQuestion]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      onUpdateQuestions(questions.filter(q => q.id !== id));
    }
  };

  // Helper to extract sorting order from problemText (e.g., "1 ", "2.", etc.)
  const extractOrder = (text: string): number => {
    const match = text.trim().match(/^(\d+|\uff11|\uff12|\uff13|\uff14|\uff15|\uff16|\uff17|\uff18|\uff19|\uff10)+/);
    if (!match) return 999999;
    // Handle both half-width and full-width numbers
    const numStr = match[0].replace(/[\uff10-\uff19]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
    return parseInt(numStr, 10);
  };

  const filteredQuestions = questions
    .filter(q => filterCategory === 'all' || q.category === filterCategory)
    .sort((a, b) => {
      // First sort by category
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      // Then by extracted number
      return extractOrder(a.problemText) - extractOrder(b.problemText);
    });

  // Category Logic
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat: Category = {
      id: String(Date.now()),
      name: newCategoryName.trim()
    };
    onUpdateCategories([...categories, newCat]);
    setNewCategoryName('');
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    const oldName = editingCategory.name;
    const newName = newCategoryName.trim();
    
    onUpdateCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: newName } : c));
    // Update all questions that had this category name
    onUpdateQuestions(questions.map(q => q.category === oldName ? { ...q, category: newName } : q));
    
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (cat: Category) => {
    if (window.confirm(`カテゴリ「${cat.name}」を削除しますか？\n※このカテゴリに属する問題のカテゴリ設定が空になります。`)) {
      onUpdateCategories(categories.filter(c => c.id !== cat.id));
      onUpdateQuestions(questions.map(q => q.category === cat.name ? { ...q, category: '' } : q));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white/80 p-8 rounded-3xl card-shadow border-4 border-yobel-green/10 w-full max-w-md">
          <div className="flex justify-center mb-6 text-yobel-green">
            <Lock size={48} />
          </div>
          <h2 className="text-2xl font-black text-center mb-6">管理画面ログイン</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力 (yobel)"
              className="w-full p-4 rounded-xl border-2 border-yobel-green/20 focus:border-yobel-green outline-none font-bold"
            />
            <button
              type="submit"
              className="w-full bg-yobel-green text-white py-4 rounded-xl font-black text-xl hover:bg-yobel-green/90 transition-all shadow-lg"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <Unlock className="text-yobel-gold" /> 問題管理
        </h2>
        <div className="flex gap-4">
          <Link 
            to="/"
            className="bg-white text-yobel-green border-2 border-yobel-green px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-yobel-green/5 transition-all shadow-md"
          >
            クイズをプレイ
          </Link>
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-white text-yobel-green border-2 border-yobel-green px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-yobel-green/5 transition-all shadow-md"
          >
            <FolderTree size={24} /> カテゴリ管理
          </button>
          <button 
            onClick={() => openModal()}
            className="bg-yobel-green text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-yobel-green/90 shadow-xl transition-all transform hover:scale-105"
          >
            <Plus size={24} /> 新規問題追加
          </button>
        </div>
      </div>

      <div className="bg-white/80 rounded-3xl card-shadow overflow-x-auto border-4 border-yobel-green/10">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-yobel-green text-white">
              <th className="p-4 font-black">
                <div className="flex items-center gap-2">
                  カテゴリ
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-white/20 text-white border border-white/30 rounded px-2 py-1 text-sm font-bold outline-none focus:bg-white/30 transition-all cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="all" className="text-zinc-800">すべて</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name} className="text-zinc-800">{cat.name}</option>
                    ))}
                  </select>
                </div>
              </th>
              <th className="p-4 font-black">問題文 / キャプション</th>
              <th className="p-4 font-black">正解 (読み)</th>
              <th className="p-4 font-black text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((q) => (
              <tr key={q.id} className="border-b border-yobel-green/10 hover:bg-yobel-green/5 transition-colors">
                <td className="p-4 font-black">{q.category}</td>
                <td className="p-4 max-w-xs">
                  {q.caption && <div className="text-xs text-yobel-green/60 italic mb-1">({q.caption})</div>}
                  <div className="truncate font-bold">{q.problemText}</div>
                </td>
                <td className="p-4">
                  <div className="font-black text-yobel-green">{q.answer}</div>
                  <div className="text-sm text-yobel-green/50">{q.reading}</div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => openModal(q)}
                      className="p-3 text-yobel-green hover:bg-yobel-green/10 rounded-xl transition-all border-2 border-transparent hover:border-yobel-green/20"
                      title="編集"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(q.id)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all border-2 border-transparent hover:border-red-200"
                      title="削除"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-parchment-light w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-yobel-gold/50 my-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b-2 border-yobel-gold/20 flex justify-between items-center">
              <h3 className="text-2xl font-black text-yobel-green">
                {editingQuestion ? '問題を編集' : '新規問題追加'}
              </h3>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-yobel-green/10 rounded-full transition-all text-yobel-green"
              >
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-yobel-green/70">カテゴリ</label>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-yobel-green/20 focus:border-yobel-green outline-none font-bold bg-white"
                  >
                    <option value="" disabled>選択してください</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black text-yobel-green/70">正解 (大文字表記)</label>
                  <input
                    required
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-yobel-green/20 focus:border-yobel-green outline-none font-bold"
                    placeholder="例: シュツエジプトキ"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-yobel-green/70">問題文</label>
                <textarea
                  required
                  name="problemText"
                  value={formData.problemText}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-3 rounded-xl border-2 border-yobel-green/20 focus:border-yobel-green outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-yobel-green/70">キャプション (問題文の上)</label>
                  <input
                    name="caption"
                    value={formData.caption}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-yobel-green/20 focus:border-yobel-green outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black text-yobel-green/70">バラバラ文字 (fixedShuffled)</label>
                  <input
                    required
                    name="fixedShuffled"
                    value={formData.fixedShuffled}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-yobel-green/20 focus:border-yobel-green outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-yobel-green/70">読み (正解時表示)</label>
                  <input
                    required
                    name="reading"
                    value={formData.reading}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-yobel-green/20 focus:border-yobel-green outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black text-yobel-green/70">コメント (任意)</label>
                  <input
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-yobel-green/20 focus:border-yobel-green outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-black text-yobel-green/70">ヒント (1〜3)</label>
                <div className="space-y-2">
                  {(formData.hints || ['', '', '']).map((hint, i) => (
                    <input
                      key={i}
                      value={hint}
                      onChange={(e) => handleHintChange(i, e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-yobel-green/20 focus:border-yobel-green outline-none font-bold text-sm"
                      placeholder={`ヒント ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-grow bg-yobel-gold text-white py-4 rounded-2xl font-black text-xl hover:bg-yobel-gold/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save size={24} /> 保存する
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 bg-zinc-200 text-zinc-600 py-4 rounded-2xl font-black text-xl hover:bg-zinc-300 transition-all"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-yobel-green/20 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b-2 border-yobel-green/10 flex justify-between items-center">
              <h3 className="text-2xl font-black text-yobel-green">カテゴリ管理</h3>
              <button 
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategory(null);
                  setNewCategoryName('');
                }}
                className="p-2 hover:bg-yobel-green/10 rounded-full transition-all text-yobel-green"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Add/Edit Input */}
              <div className="flex gap-2">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-grow p-3 rounded-xl border-2 border-yobel-green/20 focus:border-yobel-green outline-none font-bold"
                  placeholder={editingCategory ? "カテゴリ名を変更" : "新しいカテゴリ名"}
                />
                <button
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  className="bg-yobel-green text-white px-6 py-3 rounded-xl font-black hover:bg-yobel-green/90 shadow-md transition-all whitespace-nowrap"
                >
                  {editingCategory ? "更新" : "追加"}
                </button>
                {editingCategory && (
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCategoryName('');
                    }}
                    className="bg-zinc-200 text-zinc-600 px-4 py-3 rounded-xl font-black hover:bg-zinc-300"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-3 bg-yobel-green/5 rounded-xl border border-yobel-green/10 group">
                    <span className="font-bold text-yobel-green">{cat.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setNewCategoryName(cat.name);
                        }}
                        className="p-2 text-yobel-green hover:bg-yobel-green/10 rounded-lg"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="w-full bg-zinc-700 text-white py-4 rounded-xl font-black text-xl hover:bg-zinc-800 transition-all shadow-lg"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
