import PriceRange from "@/lib/PriceRange";
import {
  useGetCategoryQuery,
  useGetMaxPriceQuery,
} from "@/redux/features/product";

type Props = {
  setValues: React.Dispatch<React.SetStateAction<number[]>>;
  values: number[];
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  category: string;
};

export default function CategorySide({
  setValues,
  values,
  category,
  setCategory,
}: Props) {
  const { data: Categories } = useGetCategoryQuery();

  const { data: maxPrice } = useGetMaxPriceQuery();

  return (
    <div className="w-full md:w-65 md:h-screen p-4 flex flex-row md:flex-col gap-4 items-center md:items-start">
      <div className="flex flex-col md:flex-row items-center md:gap-5">
        <label htmlFor="category" className="font-semibold text-sm">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="appearance-none rounded-lg px-3 py-0 h-10 bg-red-400 font-semibold drop-shadow-sm my-3 text-gray-800 focus:bg-red-300"
        >
          <option className="font-semibold text-gray-800" value="">
            All Categories
          </option>
          {Categories?.map((category) => {
            return (
              <option
                key={category}
                className="font-semibold text-gray-800"
                value={category}
              >
                {category}
              </option>
            );
          })}
        </select>
      </div>
      <PriceRange values={values} setValues={setValues} MAX={maxPrice?.max} />
    </div>
  );
}
