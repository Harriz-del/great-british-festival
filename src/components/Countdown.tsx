import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: August 14, 2026 (based on Home.tsx highlights)
    const targetDate = new Date('2026-08-14T00:00:00');

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds }
  ];

  return (
    <div className="flex justify-center gap-4 md:gap-8">
      {items.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <span className="text-4xl md:text-6xl font-black italic tracking-tighter text-white tabular-nums">
              {String(item.value).padStart(2, '0')}
            </span>
            <div className={`absolute -bottom-1 left-0 w-full h-px ${idx % 2 === 0 ? 'bg-accent-cyan' : 'bg-neon-pink'} opacity-40`} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mt-2">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
