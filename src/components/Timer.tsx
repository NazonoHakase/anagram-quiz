import React, { useState, useEffect } from 'react';

interface TimerProps {
  onStop?: (seconds: number) => void;
  resetKey: any;
}

const Timer: React.FC<TimerProps> = ({ resetKey }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setSeconds(0);
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resetKey]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}分${secs.toString().padStart(2, '0')}秒`;
  };

  return (
    <div className="text-xl font-black text-yobel-gold bg-yobel-green/10 px-4 py-2 rounded-full border-2 border-yobel-gold/30">
      経過： {formatTime(seconds)}
    </div>
  );
};

export default Timer;
