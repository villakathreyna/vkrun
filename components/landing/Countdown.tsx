
import { cinzel } from '@/components/fonts';

const EVENT_DATE = new Date('2026-06-21T05:00:00+08:00');

import { useEffect, useRef, useState } from "react";
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
  // Start with zeros to avoid hydration mismatch
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTimeLeft(getTimeLeft()); // Set actual time left after mount
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
    <div className="flex flex-col items-center">
      {/* Rainbow accent */}
      <div className="flex mb-2">
        <div className="h-2 w-8 rounded-l-full bg-[#e94057]" />
        <div className="h-2 w-8 bg-[#f27121]" />
        <div className="h-2 w-8 bg-[#f9d423]" />
        <div className="h-2 w-8 bg-[#e6c97a]" />
        <div className="h-2 w-8 rounded-r-full bg-[#b6a04c]" />
      </div>
      <div className="flex gap-3 md:gap-5">
        {blocks.map((b) => (
          <div key={b.label} className="flex flex-col items-center">
            <div className="bg-[#1a2e1a]/90 border-2 border-[#e6c97a] rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg">
              <span className={`text-2xl md:text-3xl font-bold text-[#e6c97a] ${cinzel.variable} font-cinzel`} style={{ fontFamily: 'Cinzel Decorative, Cinzel, serif' }}>
                {String(b.value).padStart(2, '0')}
              </span>
            </div>
            <span className={`text-xs md:text-sm text-[#e6c97a]/90 mt-1.5 uppercase tracking-wider ${cinzel.variable} font-cinzel`}>
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
