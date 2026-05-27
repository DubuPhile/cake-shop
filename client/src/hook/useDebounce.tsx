import { useEffect, useState } from "react";

interface debounce {
  value: string;
  delay?: number;
}

export const useDebounce = ({ value, delay = 500 }: debounce) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // cleanup
  }, [value, delay]);

  return debouncedValue;
};
