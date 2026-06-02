import {
  ProductSize,
  useGetProductStockQuery,
  useUpdateStocksMutation,
} from "@/redux/features/product";
import { useEffect, useState } from "react";
import Header from "../Header";
import { X } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  id: string;
  name: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function StocksModal({ id, onClose, isOpen, name }: Props) {
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [show, setShow] = useState(false);

  const { data: stocks, isLoading, isError } = useGetProductStockQuery(id);
  const [updateStock] = useUpdateStocksMutation();

  useEffect(() => {
    if (stocks) setSizes(stocks?.data);
  }, [stocks]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setShow(true);
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    const timer = setTimeout(() => {
      onClose();
    }, 500);
  };

  const UpdateStocks = (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const updatedstock = updateStock(sizes).unwrap();
      if (!updatedstock) return toast.error("Error update Stock");

      toast.success("Product Stock Update!");
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const content = (
    <>
      <div
        className={`fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center h-full w-full z-50 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className={`relative my-10 w-70 md:w-100 shadow-lg rounded-md bg-white dark:bg-gray-800 h-auto overflow-y-auto transition-all duration-300 ${
            show
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-4 opacity-0"
          }`}
        >
          <div className="bg-gray-100 rounded-t-md py-6 px-6 drop-shadow-lg">
            <Header name={`Update ${name}`} />
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 mx-4 my-4 cursor-pointer rounded-full"
            >
              <X className="w-4 h-4 md:w-7 md:h-7 text-gray-800 hover:bg-red-400 rounded-full" />
            </button>
            <form onSubmit={UpdateStocks}>
              <div className="grid grid-cols-3 gap-2 mb-2 font-semibold text-xs md:text-base text-gray-700 mt-5">
                <h3 className="w-full flex justify-center">Sizes</h3>
                <h3 className="w-full flex justify-center">Prices</h3>
                <h3 className="w-full flex justify-center">Stock</h3>
              </div>

              {sizes.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-2 mb-2 text-xs md:text-base"
                >
                  <div
                    id={`size-${index}`}
                    className="flex w-full justify-center p-2 rounded-lg border-gray-400"
                  >
                    {item.size}
                  </div>

                  <input
                    id={`price-${index}`}
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => {
                      const updatedSizes = [...sizes];

                      updatedSizes[index] = {
                        ...updatedSizes[index],
                        price: Number(e.target.value),
                      };

                      setSizes(updatedSizes);
                    }}
                    className="border pl-3 rounded-lg border-gray-400 text-center"
                  />

                  <input
                    id={`stock-${index}`}
                    type="number"
                    placeholder="Stock"
                    value={item.stock}
                    onChange={(e) => {
                      const updatedSizes = [...sizes];

                      updatedSizes[index] = {
                        ...updatedSizes[index],
                        stock: Number(e.target.value),
                      };

                      setSizes(updatedSizes);
                    }}
                    className="border pl-3 rounded-lg border-gray-400 text-center"
                  />
                </div>
              ))}
              <div className="w-full flex flex-row justify-end">
                <button className="px-3 py-2 rounded-lg bg-red-200 hover:bg-red-300 font-semibold text-xs md:text-base cursor-pointer">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );

  return content;
}
