import useOutsideClick from "@/hook/useOutsideClick";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  productId: string;
};

export default function ProductOption({ productId }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const openRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick({ ref: openRef, callback: () => setOpen(false) });

  const handleDelete = () => {
    console.log(`delete ${productId}`);
  };
  const handleAddStock = () => {
    console.log(`addStock ${productId}`);
  };
  return (
    <div ref={openRef} className="absolute top-0 right-0 inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex justify-end bg-transparent rounded-lg`}
      >
        <EllipsisVertical
          className={`w-8 h-8 hover:bg-gray-300 px-2 py-2 rounded-lg ${open ? "inset-shadow-[1px_2px_3px_rgba(0,0,0,0.3)] bg-gray-200 " : ""}`}
        />
      </button>
      <div
        className={`z-1000 w-auto flex flex-col items-end rounded-[10px] bg-[hsl(359,100%,75%)] shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-200 ${
          open
            ? "visible -translate-y-1 opacity-100 pointer-events-auto"
            : "invisible -translate-y-2.5 opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          className={`cursor-pointer flex text-xs  w-auto bg-[hsl(359,100%,75%)] justify-end px-2 py-1 text-white rounded-[10px] rounded-tr-none hover:bg-[hsl(359,100%,65%)]`}
          onClick={handleAddStock}
        >
          {" "}
          Stocks
        </button>
        <button
          type="button"
          className={`cursor-pointer flex text-xs  w-auto bg-[hsl(359,100%,75%)] justify-end px-2 py-1 text-white rounded-[10px] md:rounded-tr-none hover:bg-[hsl(359,100%,65%)]`}
          onClick={handleDelete}
        >
          {" "}
          Delete
        </button>
      </div>
    </div>
  );
}
