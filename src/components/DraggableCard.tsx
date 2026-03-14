import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Propsの型定義（元のコードに合わせて調整してください。必要に応じて修正）
interface DraggableCardProps {
  char: string;
  id?: string;
  index: number;
  isCorrect?: boolean;
  // 必要に応じて他のpropsを追加（例: className, onClick など）
}

const DraggableCard: React.FC<DraggableCardProps> = ({ char, id, index, isCorrect }) => {
  const ref = useRef<HTMLDivElement>(null);  // refを明示的に作成

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id, char, originalIndex: index, fromSlot: false },  // fromSlotは必要に応じて
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !!char && !isCorrect,  // 正解済みカードはドラッグ不可
  }), [char, id, index, isCorrect]);

  // refにdragを接続（これで型エラーが消える）
  drag(ref);

  return (
    <div
      ref={ref}  // ← これで型が完全に一致
      className={cn(
        "w-12 h-14 md:w-16 md:h-20 rounded-lg border-2 transition-all flex items-center justify-center cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-50 scale-95 rotate-6" : "opacity-100",
        isCorrect 
          ? "bg-lime-300 border-lime-500 text-yobel-green shadow-lg" 
          : "bg-yobel-lightGreen border-yobel-green/40 text-yobel-green hover:bg-lime-200"
      )}
    >
      <div className="text-2xl md:text-4xl font-black select-none">
        {char}
      </div>
    </div>
  );
};

export default DraggableCard;