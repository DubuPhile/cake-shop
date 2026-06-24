import useOutsideClick from "@/hook/useOutsideClick";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ImageOption({ setDeleteModal }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const openRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick({ ref: openRef, callback: () => setOpen(false) });

  const handleDelete = () => {
    setDeleteModal(true);
  };
  return (
    <div
      ref={openRef}
      className="absolute top-0 right-0 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-x-1"
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className=" p-1 m-2 bg-gray-200 hover:bg-gray-300 dark:bg-black/40 dark:hover:bg-black/50 dark:active:bg-black/60 rounded-lg cursor-pointer"
      >
        <EllipsisVertical className="w-4 h-4" />
      </button>
      <div
        className={`z-1000 w-auto flex flex-col items-end rounded-[10px] bg-gray-200 shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-200 -translate-x-8 ${
          open
            ? "visible -translate-y-2 opacity-100 pointer-events-auto"
            : "invisible -translate-y-2.5 opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          className={`cursor-pointer flex text-base w-auto bg-[hsl(359,100%,75%)] justify-end px-2 py-1 text-gray-700 rounded-[10px] rounded-tr-none hover:bg-[hsl(359,100%,65%)] font-semibold`}
          onClick={handleDelete}
        >
          {" "}
          Delete
        </button>
      </div>
    </div>
  );
}
