import { MyCart } from "@/redux/features/cartSlice";
import { Trash2Icon } from "lucide-react";

type Props = {
  item: MyCart;
  checkItems: MyCart[];
  handleCheckboxChange: (checked: boolean, item: MyCart) => void;
  handleDeleteCart: (cartId: string) => void;
};

export default function CartItem({
  item,
  checkItems,
  handleCheckboxChange,
  handleDeleteCart,
}: Props) {
  return (
    <div className="grid grid-cols-7 gap-2 border-b border-b-gray-300 px-2 py-2 items-center mt-2">
      <div className="col-span-3">
        <label className="flex gap-2 items-center">
          <div className="rounded">
            <input
              type="checkbox"
              value={item.id}
              checked={checkItems.some((cartItem) => cartItem.id === item.id)}
              onChange={(e) => handleCheckboxChange(e.target.checked, item)}
              className=" w-5 h-5 accent-red-400 border-gray-300 focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="w-[35%] flex justify-center items-center">
            <img
              src={item.product.images?.[0].url}
              className="w-30 rounded-2xl"
            />
          </div>
          <div className="flex flex-col gap-1 w-[65%]">
            <h3 className="font-semibold line-clamp-1">{item.product.name}</h3>
            <h4 className="font-bold">Description:</h4>
            <p className="line-clamp-2">{item.product.description}</p>
            <div>
              <span className="font-semibold">Size:</span> {item.size.size}
            </div>
          </div>
        </label>
      </div>
      <div className="col-span-1 text-center">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "PHP",
        }).format(item.size.price)}
      </div>
      <div className="col-span-1 text-center">{item.quantity}</div>
      <div className="col-span-1 text-center">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "PHP",
        }).format(item.size.price * item.quantity)}
      </div>
      <div className="col-span-1 flex justify-center">
        <button
          className="flex gap-1 bg-gray-300 items-center px-2 py-1 rounded-lg text-gray-800 font-bold hover:bg-red-400 -translate-y-0.5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] active:bg-red-500 active:translate-y-0 active:drop-shadow-none text-sm md:text-lg cursor-pointer"
          onClick={() => handleDeleteCart(item.id || "")}
        >
          <Trash2Icon className="w-5 h-5" />
          Delete
        </button>
      </div>
    </div>
  );
}
