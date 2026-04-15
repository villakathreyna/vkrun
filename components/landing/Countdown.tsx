
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
      {/* Full rainbow accent */}
      <div className="flex mb-2 w-full max-w-xs overflow-hidden rounded-full">
        <div className="h-2 flex-1" style={{ background: 'linear-gradient(90deg, #e94057 0%, #f27121 16%, #ffe600 33%, #4cd964 50%, #2196f3 66%, #7c4dff 83%, #e040fb 100%)' }} />
      </div>
      <div className="flex gap-3 md:gap-5">
        {blocks.map((b, i) => (
          <div key={b.label} className="flex flex-col items-center">
            <div className="bg-[#1a2e1a]/90 border-2 border-[#e6c97a] rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg">
              <span className={`text-2xl md:text-3xl font-extrabold text-[#e6c97a] drop-shadow-lg ${cinzel.variable} font-cinzel`} style={{ fontFamily: 'Cinzel Decorative, Cinzel, serif', letterSpacing: '0.05em' }}>
                {String(b.value).padStart(2, '0')}
              </span>
            </div>
            <span className={`text-sm md:text-base font-bold mt-2 uppercase tracking-widest px-2 py-0.5 rounded-full`} style={{
              color: '#fff',
              background: [
                'linear-gradient(90deg, #e94057 0%, #f27121 100%)', // Days
                'linear-gradient(90deg, #f27121 0%, #ffe600 100%)', // Hours
                'linear-gradient(90deg, #4cd964 0%, #2196f3 100%)', // Minutes
                'linear-gradient(90deg, #7c4dff 0%, #e040fb 100%)', // Seconds
              ][i],
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)'
            }}>
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
