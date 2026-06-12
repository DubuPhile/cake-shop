export const TimeInterval = (date: string | Date) => {
  const now = new Date();
  const targetDate = new Date(date);

  const seconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds < 10) return "just now";

  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);

    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return `${seconds} seconds ago`;
};
