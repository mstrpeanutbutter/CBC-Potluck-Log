
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  date?: string;
  time?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ date, time }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    if (!date) return;
    
    // Attempt to parse: "Month Day, Year H:MM AM/PM"
    const targetDate = new Date(`${date} ${time || ''}`);
    
    if (isNaN(targetDate.getTime())) {
        console.warn("Could not parse date:", date, time);
        return;
    }

    const calculate = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setIsPast(true);
        setTimeLeft(null);
      } else {
        setIsPast(false);
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    calculate(); // Initial run
    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [date, time]);

  if (!date || (!timeLeft && !isPast)) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border border-green-100 rounded-3xl p-6 sm:p-8 mb-8 text-center shadow-md relative overflow-hidden group">
        {/* Animated background sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 select-none">
            <span className="absolute top-2 left-6 text-xl animate-pulse">✨</span>
            <span className="absolute bottom-4 right-10 text-xl animate-bounce delay-75">✨</span>
            <span className="absolute top-12 right-6 text-xl animate-pulse delay-150">🎉</span>
            <span className="absolute bottom-10 left-8 text-xl animate-bounce delay-300">🥗</span>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full group-hover:bg-white/40 transition-all duration-700"></div>
        </div>

        <div className="relative z-10">
            <h2 className="text-sm sm:text-base font-black text-green-800 uppercase tracking-[0.25em] mb-6 flex items-center justify-center gap-3">
                <span className="text-2xl drop-shadow-sm">🥣</span>
                Countdown to Deliciousness
                <span className="text-2xl drop-shadow-sm">🥣</span>
            </h2>

            {isPast ? (
                <div className="animate-fadeIn">
                    <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700 drop-shadow-sm">
                        The Feast has Begun! 🌱✨
                    </p>
                    <p className="text-sm sm:text-base text-green-600 mt-2 font-medium">
                        Grab your plate and enjoy the community goodness!
                    </p>
                </div>
            ) : timeLeft && (
                <div className="flex justify-center gap-3 sm:gap-6">
                    {[
                        { label: 'Days', value: timeLeft.d },
                        { label: 'Hrs', value: timeLeft.h },
                        { label: 'Min', value: timeLeft.m },
                        { label: 'Sec', value: timeLeft.s }
                    ].map((segment, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-green-100 w-16 h-18 sm:w-20 sm:h-24 flex flex-col items-center justify-center group-hover:translate-y-[-4px] transition-transform duration-300">
                                <span className="text-2xl sm:text-4xl font-black text-green-600 tabular-nums tracking-tighter">
                                    {segment.value.toString().padStart(2, '0')}
                                </span>
                            </div>
                            <span className="mt-2 text-[10px] sm:text-xs font-black text-green-700 uppercase tracking-widest opacity-80">
                                {segment.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default CountdownTimer;
