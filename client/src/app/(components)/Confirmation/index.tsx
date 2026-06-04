import Header from "@/app/( dashboard )/(dashboardComponents)/Header";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  Purpose?: string;
  name?: string;
}

export default function Confirmation({
  isOpen,
  onClose,
  onConfirm,
  Purpose,
  name,
}: ConfirmationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setShow(true);
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const Confirm = () => {
    onConfirm();
    handleClose();
  };
  const Cancel = () => {
    handleClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`w-full max-w-60 md:max-w-md rounded-2xl bg-white dark:bg-gray-600 shadow-xl transition-all duration-500 ${
          show
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
      >
        <div className="bg-gray-100 dark:bg-gray-700 rounded-t-md py-3 px-3 drop-shadow-lg">
          <Header name={"Confirmation"} />
          <button
            onClick={handleClose}
            className="absolute top-0 right-0 mx-4 my-4 cursor-pointer rounded-full"
          >
            <CircleX className="w-4 h-4 md:w-7 md:h-7 text-gray-800 hover:bg-red-400 rounded-full" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-col items-center justify-center w-full h-30 md:h-50 gap-5 p-5">
          <h2 className="text-base md:text-2xl text-center font-semibold">
            Are you sure {Purpose ? `you want to ${Purpose}` : ""}{" "}
            {name ? name : ""}?
          </h2>
          <div className="w-full flex justify-center gap-15">
            <button
              type="button"
              onClick={Confirm}
              className="bg-green-300 dark:bg-green-700 dark:hover:bg-green-600 dark:active:bg-green-500 hover:bg-green-400 active:bg-green-500 px-2 py-1 md:px-4 md:py-2 rounded-lg font-semibold  text-sm md:text-base cursor-pointer"
            >
              YES
            </button>
            <button
              type="button"
              onClick={Cancel}
              className="bg-red-300 dark:bg-red-800 dark:hover:bg-red-600 dark:active:bg-red-500 hover:bg-red-400 active:bg-red-500 px-2 py-1 md:px-4 md:py-2 rounded-lg font-semibold  text-sm md:text-base cursor-pointer"
            >
              NO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
