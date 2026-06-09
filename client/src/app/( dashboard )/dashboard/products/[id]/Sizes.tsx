import AddSizeModal from "@/app/( dashboard )/(dashboardComponents)/AddSizeModal";
import {
  ProductSize,
  useDeleteSizeMutation,
  useUpdateStocksMutation,
} from "@/redux/features/product";
import { Ban, Save, SquarePen } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  sizes: ProductSize[];
  setSizes: (sizes: ProductSize[]) => void;
  onCancel: () => void;
  refetch: () => void;
  id: string;
};

export default function Sizes({
  sizes,
  setSizes,
  onCancel,
  refetch,
  id,
}: Props) {
  const [disable, setDisable] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [updateStock] = useUpdateStocksMutation();
  const [deleteSize] = useDeleteSizeMutation();

  const addSize = () => {
    setOpenModal(true);
  };

  const removeSize = async (id: string, size: string) => {
    try {
      await deleteSize(id).unwrap();

      refetch();
      toast.success(`${size} has been Deleted!`);
    } catch (err) {
      console.log(err);
      toast.error(`Delete ${size} Failed!`);
    }
  };

  const onCanceled = async () => {
    onCancel();
    setDisable(false);
  };

  const updateStocks = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      await updateStock(sizes).unwrap();

      refetch();
      setDisable(false);
      toast.success("Update Success!");
    } catch (err) {
      console.log(err);
      toast.error("Update Stock Failed");
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 mb-2 font-semibold text-xs md:text-base">
        <h3 className="w-full flex justify-center items-center">Size</h3>
        <h3 className="w-full flex justify-center items-center">Price</h3>
        <h3 className="w-full flex justify-center items-center">Stock</h3>
        {!disable && (
          <div>
            <button
              type="button"
              onClick={() => setDisable(true)}
              className="flex w-22 justify-center gap-1 px-2 py-1 items-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              <span className="font-semibold">Edit</span>{" "}
              <SquarePen className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {sizes.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-2 mb-2 text-xs md:text-base"
        >
          <input
            id={`size-${index}`}
            type="text"
            placeholder="S, M, L"
            value={item.size}
            disabled={!disable}
            onChange={(e) => {
              const updated = [...sizes];
              updated[index].size = e.target.value;
              setSizes(updated);
            }}
            className={`rounded-lg ${disable ? "border border-gray-400" : ""} text-center p-2`}
          />

          <input
            id={`price-${index}`}
            type="number"
            placeholder="Price"
            value={item.price}
            disabled={!disable}
            onChange={(e) => {
              const updatedSizes = [...sizes];

              updatedSizes[index] = {
                ...updatedSizes[index],
                price: Number(e.target.value),
              };

              setSizes(updatedSizes);
            }}
            className={`rounded-lg ${disable ? "border border-gray-400" : ""} text-center pl-3`}
          />

          <input
            id={`stock-${index}`}
            type="number"
            placeholder="Stock"
            value={item.stock}
            disabled={!disable}
            onChange={(e) => {
              const updatedSizes = [...sizes];

              updatedSizes[index] = {
                ...updatedSizes[index],
                stock: Number(e.target.value),
              };

              setSizes(updatedSizes);
            }}
            className={`rounded-lg ${disable ? "border border-gray-400" : ""} text-center pl-3`}
          />

          <button
            type="button"
            onClick={() => removeSize(item.id || "", item.size || "")}
            className="bg-red-300 hover:bg-red-400 active:bg-red-500 px-3 rounded-2xl w-22 text-xs md:text-base text-gray-700 drop-shadow-lg font-semibold cursor-pointer"
          >
            Remove
          </button>
        </div>
      ))}
      {!disable ? (
        <button
          type="button"
          onClick={addSize}
          className="bg-green-300 hover:bg-green-400 active:bg-green-500 px-3 py-2 rounded-2xl text-xs md:text-base text-gray-700 drop-shadow-lg font-semibold ml-6"
        >
          Add Size
        </button>
      ) : (
        <div className="gap-2 flex mt-5">
          <button
            type="button"
            onClick={onCanceled}
            className="flex justify-center gap-1 px-3 py-2 items-center rounded-2xl  hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
          >
            <Ban className="w-4 h-4" />
            <span className="font-semibold">Cancel</span>{" "}
          </button>
          <button
            type="button"
            onClick={updateStocks}
            className="flex justify-center gap-1 px-3 py-2 items-center rounded-2xl bg-green-300 hover:bg-green-400 active:bg-green-500  dark:bg-green-600 dark:hover:bg-green-700 dark:active:bg-green-800 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span className="font-semibold">Save</span>
          </button>
        </div>
      )}

      {openModal && (
        <AddSizeModal
          id={id.toString()}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          refetch={refetch}
        />
      )}
    </>
  );
}
