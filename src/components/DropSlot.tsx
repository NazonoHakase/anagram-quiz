import React, { useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DropSlotProps {
  index: number;
  char?: string;
  charId?: string;
  isCorrect?: boolean;
  onDrop: (item: { id: string, char: string, originalIndex: number, fromSlot?: boolean }, targetIndex: number) => void;
}

const DropSlot: React.FC<DropSlotProps> = ({ index, char, charId, isCorrect, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: { id: string, char: string, originalIndex: number, fromSlot?: boolean }) => onDrop(item, index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [index, onDrop]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id: charId, char, originalIndex: index, fromSlot: true },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !!charId && !isCorrect,
  }), [charId, char, index, isCorrect]);

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cn(
        "w-12 h-14 md:w-16 md:h-20 rounded-lg border-2 border-dashed transition-all flex items-center justify-center cursor-move",
        isOver || isDragging ? "bg-lime-300 border-lime-500 scale-x-105" : "bg-black/5 border-black/10",
        char ? "border-solid" : "",
        isDragging ? "opacity-30" : "opacity-100"
      )}
    >
      {char && !isDragging && (
        <div className={cn(
          "w-full h-full flex items-center justify-center text-2xl md:text-4xl font-black rounded-lg transition-all card-shadow border-2",
          isCorrect || char 
            ? "bg-lime-300 border-lime-500 text-yobel-green" 
            : "bg-yobel-lightGreen border-yobel-green/20 text-yobel-green"
        )}>
          {char}
        </div>
      )}
      {!char && isOver && (
        <div className="text-lime-600/30 animate-pulse font-black">?</div>
      )}
    </div>
  );
};

export default DropSlot;