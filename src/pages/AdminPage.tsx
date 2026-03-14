import React, { useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // モーダル関連状態（これが欠けていると開かない）
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

  // ログイン処理（変更なし）
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'yobel') {
      setIsAuthenticated(true);
      setError(null);
      localStorage.setItem('yobel_admin', 'true');
    } else {
      setError('パスワードが違います');
      setPassword('');
    }
  };

  // 新規/編集モーダルを開く
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
    setFormData({}); // リセット
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

  // カテゴリ管理
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat: Category = { id: String(Date.now()), name: newCategoryName.trim() };
    onUpdateCategories([...categories, newCat]);
    setNewCategoryName('');
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    const oldName = editingCategory.name;
    const newName = newCategoryName.trim();
    onUpdateCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: newName } : c));
    onUpdateQuestions(questions.map(q => q.category === oldName ? { ...q, category: newName } : q));
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (cat: Category) => {
    if (window.confirm(`カテゴリ「${cat.name}」を削除しますか？`)) {
      onUpdateCategories(categories.filter(c => c.id !== cat.id));
      onUpdateQuestions(questions.map(q => q.category === cat.name ? { ...q, category: '' } : q));
    }
  };

  // ログイン画面
  if (!isAuthenticated && localStorage.getItem('yobel_admin') !== 'true') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full border-2 border-amber-200">
          <h2 className="text-3xl font-black text-center mb-8 text-emerald-950">
            管理画面ログイン
          </h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              className="w-full p-4 border-2 border-amber-300 rounded-xl mb-6 focus:outline-none focus:border-emerald-600 text-lg text-emerald-950 bg-white"
              autoFocus
            />
            {error && <p className="text-red-600 text-center mb-4 font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-700 text-white py-4 rounded-xl font-black text-xl hover:bg-emerald-800 transition-colors"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 管理画面本体
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-black flex items-center gap-3 text-emerald-950">
          <Unlock className="text-amber-600" /> 問題管理
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link 
            to="/"
            className="bg-white text-emerald-700 border-2 border-emerald-300 px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-sm"
          >
            クイズをプレイ
          </Link>
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-white text-emerald-700 border-2 border-emerald-300 px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-sm"
          >
            <FolderTree size={20} /> カテゴリ管理
          </button>
          <button 
            onClick={() => openModal()}
            className="bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-800 transition-all shadow-md"
          >
            <Plus size={20} /> 新規問題追加
          </button>
        </div>
      </div>

      {/* 問題一覧テーブル */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-800 text-white">
              <th className="p-4 font-bold">
                カテゴリ
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="ml-3 bg-white/30 text-white border border-white/40 rounded px-2 py-1 text-sm outline-none focus:bg-white/50"
                >
                  <option value="all" className="text-emerald-950 bg-white">すべて</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name} className="text-emerald-950 bg-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </th>
              <th className="p-4 font-bold">問題文 / キャプション</th>
              <th className="p-4 font-bold">正解 (読み)</th>
              <th className="p-4 font-bold text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {questions
              .filter(q => filterCategory === 'all' || q.category === filterCategory)
              .map((q) => (
                <tr key={q.id} className="border-b border-amber-100 hover:bg-amber-50/50 transition-colors">
                  <td className="p-4 font-medium text-emerald-900">{q.category}</td>
                  <td className="p-4">
                    {q.caption && <div className="text-sm text-amber-700 italic mb-1">({q.caption})</div>}
                    <div className="font-medium text-emerald-950">{q.problemText}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-emerald-800">{q.answer}</div>
                    <div className="text-sm text-amber-700">{q.reading}</div>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => openModal(q)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors mx-1"
                      title="編集"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(q.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mx-1"
                      title="削除"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 新規/編集問題モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-b from-amber-50 to-yellow-50 w-full max-w-4xl rounded-2xl shadow-2xl border-4 border-amber-400/70 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-amber-200 flex justify-between items-center sticky top-0 bg-gradient-to-b from-amber-50 to-yellow-50 z-10">
              <h3 className="text-2xl font-black text-emerald-950">
                {editingQuestion ? '問題を編集' : '新規問題追加'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-amber-100 rounded-full text-emerald-700">
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 text-emerald-950">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-emerald-800">カテゴリ</label>
                  <select
                    required
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-amber-300 focus:border-emerald-600 bg-white text-emerald-950 font-medium"
                  >
                    <option value="">選択してください</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-black text-emerald-800">正解 (大文字表記)</label>
                  <input
                    required
                    name="answer"
                    value={formData.answer || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-amber-300 focus:border-emerald-600 bg-white text-emerald-950 font-medium"
                    placeholder="例: シュツエジプトキ"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-emerald-800">問題文</label>
                <textarea
                  required
                  name="problemText"
                  value={formData.problemText || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 rounded-xl border-2 border-amber-300 focus:border-emerald-600 bg-white text-emerald-950 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-emerald-800">キャプション (問題文の上)</label>
                  <input
                    name="caption"
                    value={formData.caption || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-amber-300 focus:border-emerald-600 bg-white text-emerald-950 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black text-emerald-800">バラバラ文字 (fixedShuffled)</label>
                  <input
                    required
                    name="fixedShuffled"
                    value={formData.fixedShuffled || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-amber-300 focus:border-emerald-600 bg-white text-emerald-950 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-emerald-800">読み (正解時表示)</label>
                  <input
                    required
                    name="reading"
                    value={formData.reading || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-amber-300 focus:border-emerald-600 bg-white text-emerald-950 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black text-emerald-800">コメント (任意)</label>
                  <input
                    name="comment"
                    value={formData.comment || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border-2 border-amber-300 focus:border-emerald-600 bg-white text-emerald-950 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-black text-emerald-800">ヒント (1〜3)</label>
                <div className="space-y-2">
                  {(formData.hints || ['', '', '']).map((hint, i) => (
                    <input
                      key={i}
                      value={hint}
                      onChange={(e) => handleHintChange(i, e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-amber-300 focus:border-emerald-600 bg-white text-emerald-950 font-medium text-sm"
                      placeholder={`ヒント ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 bg-amber-600 text-white py-4 rounded-xl font-black hover:bg-amber-700">
                  保存する
                </button>
                <button type="button" onClick={closeModal} className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-black hover:bg-gray-300">
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* カテゴリ管理モーダル */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-yellow-50 w-full max-w-lg rounded-2xl shadow-2xl border-4 border-amber-400/70">
            <div className="p-6 border-b-2 border-amber-200 flex justify-between items-center sticky top-0 bg-gradient-to-b from-amber-50 to-yellow-50 z-10">
              <h3 className="text-2xl font-black text-emerald-950">カテゴリ管理</h3>
              <button 
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategory(null);
                  setNewCategoryName('');
                }}
                className="p-2 hover:bg-amber-100 rounded-full text-emerald-700"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex gap-2">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-grow p-3 rounded-xl border-2 border-amber-300 focus:border-emerald-600 bg-white text-emerald-950 font-medium"
                  placeholder={editingCategory ? "カテゴリ名を変更" : "新しいカテゴリ名"}
                />
                <button
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-black hover:bg-emerald-800"
                >
                  {editingCategory ? "更新" : "追加"}
                </button>
                {editingCategory && (
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCategoryName('');
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-3 rounded-xl font-black hover:bg-gray-300"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-3 bg-amber-50/50 rounded-xl border border-amber-200 group">
                    <span className="font-bold text-emerald-900">{cat.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setNewCategoryName(cat.name);
                        }}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-full bg-gray-700 text-white py-4 rounded-xl font-black text-lg hover:bg-gray-800 mt-4"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;