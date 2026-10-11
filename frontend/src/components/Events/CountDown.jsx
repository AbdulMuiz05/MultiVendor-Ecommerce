import React, { useEffect, useState } from "react";

const CountDown = ({ endDate }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(endDate).getTime() - Date.now();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
      <span>{String(timeLeft.days).padStart(2, "0")}d</span>
      <span>:</span>
      <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
      <span>:</span>
      <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
      <span>:</span>
      <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
    </div>
  );
};

export default CountDown;