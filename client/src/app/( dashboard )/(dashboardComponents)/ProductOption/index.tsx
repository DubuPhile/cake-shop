import useOutsideClick from "@/hook/useOutsideClick";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState } from "react";
import StocksModal from "../StocksModal";
import Confirmation from "@/app/(components)/Confirmation";
import { useDeleteProductMutation } from "@/redux/features/product";
import toast from "react-hot-toast";

type Props = {
  productId: string;
  name: string;
  refetch: () => void;
};

export default function ProductOption({ productId, name, refetch }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const openRef = useRef<HTMLDivElement | null>(null);
  const [deleteProduct] = useDeleteProductMutation();

  useOutsideClick({ ref: openRef, callback: () => setOpen(false) });

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const ConfirmDelete = async () => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success(`${name} Deleted!`);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error("Delete Error");
    }
  };

  const handleAddStock = () => {
    setIsModalOpen(true);
  };
  return (
    <div ref={openRef} className="absolute top-0 right-0 inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex justify-end bg-transparent rounded-lg`}
      >
        <EllipsisVertical
          className={`w-8 h-8 bg-white/60 dark:bg-black/20 hover:bg-gray-300 dark:hover:bg-gray-900 px-2 py-2 rounded-lg cursor-pointer ${open ? "inset-shadow-[1px_2px_3px_rgba(0,0,0,0.3)] bg-gray-200 " : ""}`}
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
      {/* MODAL */}
      {isModalOpen && (
        <StocksModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          id={productId}
          name={name}
          refetch={refetch}
        />
      )}
      {isDeleteModalOpen && (
        <Confirmation
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={ConfirmDelete}
          Purpose="Delete"
          name={name}
        />
      )}
    </div>
  );
}
