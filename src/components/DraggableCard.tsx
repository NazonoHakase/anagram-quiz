import React from 'react';
import { useDrag } from 'react-dnd';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DraggableCardProps {
  id: string;
  char: string;
  index: number;
  isCorrect?: boolean;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ id, char, index, isCorrect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id, char, originalIndex: index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id, char, index]);

  return (
    <div
      ref={drag}
      className={cn(
        "w-12 h-14 md:w-16 md:h-20 flex items-center justify-center text-2xl md:text-4xl font-black rounded-lg cursor-grab active:cursor-grabbing transition-all card-shadow border-2 select-none",
        isDragging ? "bg-lime-300 border-lime-500 opacity-50 scale-110" : "bg-yobel-lightGreen border-yobel-green/20 text-yobel-green hover:border-yobel-green/50",
        isCorrect ? "bg-lime-300 border-lime-500 text-yobel-green scale-105 cursor-default" : ""
      )}
    >
      {char}
    </div>
  );
};

export default DraggableCard;
