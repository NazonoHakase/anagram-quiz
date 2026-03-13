export interface Question {
  id: number;
  category: string;
  problemText: string;
  caption?: string;          // 正解表示時のキャプション
  comment?: string;          // コメント行
  fixedShuffled: string;
  answer: string;
  reading: string;
  hints: string[];
}

export interface Category {
  id: string;
  name: string;
}
