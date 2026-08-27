import { useEffect, useState } from "react";

function Clock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <time className="taskbar-clock" dateTime={time.toISOString()}>
      <span>
        {time.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}
      </span>
      <span>
        {time.toLocaleDateString([], {
          month: "numeric",
          day: "numeric",
          year: "2-digit",
        })}
      </span>
    </time>
  );
}

export default Clock;
