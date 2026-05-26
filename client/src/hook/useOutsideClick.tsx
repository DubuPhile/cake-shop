import { useEffect, RefObject } from "react";

type Props = {
  ref: RefObject<HTMLElement | null>;
  callback: () => void;
};

export default function useOutsideClick({ ref, callback }: Props) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback]);
}
