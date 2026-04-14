import React, { useState, useEffect } from 'react';

const EVENT_DATE = new Date('2026-06-21T05:00:00+08:00');

function getTimeLeft() {
  const now = new Date();
  const diff = EVENT_DATE.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const blocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 md:gap-5">
      {blocks.map((b) => (
        <div key={b.label} className="flex flex-col items-center">
          <div className="bg-[#1a2e1a]/90 border-2 border-[#e6c97a] rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg">
            <span className="text-2xl md:text-3xl font-cinzel font-bold text-[#e6c97a]">
              {String(b.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs md:text-sm text-[#e6c97a]/80 font-cinzel mt-1.5 uppercase tracking-wider">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
