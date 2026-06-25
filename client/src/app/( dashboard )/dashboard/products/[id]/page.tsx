"use client";

import {
  Products,
  useGetProductInfoQuery,
  useUpdateProductDetailsMutation,
} from "@/redux/features/product";
import { Ban, Save, SquarePen } from "lucide-react";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Category from "./Category";
import Sizes from "./Sizes";
import Spinner from "@/app/(components)/Spinner";
import ImageSection from "@/app/(components)/ImageSection";
import CommentSection from "@/app/(components)/CommentSection";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/store";

export default function ProductPage() {
  const { id } = useParams();
  if (!id) return;
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductInfoQuery(id?.toString());
  const [changeDetails] = useUpdateProductDetailsMutation();
  const [otherCategory, setOtherCategory] = useState<boolean>(false);

  const { isSidebarCollapsed } = useAppSelector((state) => state.global);

  const [disabled, setDisabled] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [form, setForm] = useState<Products>({
    id: "",
    name: "",
    category: "",
    description: "",
    images: [],
    sizes: [],
    averageRating: 0,
  });

  const handleChangeDetails = async () => {
    try {
      const updatedProduct = await changeDetails({
        id: form.id,
        name: form.name,
        description: form.description,
        category: form.category,
      }).unwrap();
      setDisabled(false);
      setOtherCategory(false);
      toast.success("Save Changes", {
        style: {
          fontWeight: "600",
          color: "green",
        },
      });
    } catch (err: any) {
      console.log(err);
      toast.error("Change Failed", {
        style: {
          fontWeight: "600",
          color: "red",
        },
      });
    }
  };

  const handleCancel = () => {
    setDisabled(false);
  };

  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      description: value,
    }));

    adjustHeight();
  };

  /** USE EFFECTS */

  useEffect(() => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        images: product.images,
        sizes: product.sizes ?? [],
        averageRating: product.averageRating,
      });
    }
  }, [product]);

  useLayoutEffect(() => {
    adjustHeight();
  }, [form.description, adjustHeight]);

  useEffect(() => {
    window.addEventListener("resize", adjustHeight);

    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, []);

  const content = (
    <>
      <div className="relative flex flex-col max-w-270 items-center md:items-baseline">
        <div className="flex flex-col w-full sm:w-100 md:w-130 transition-all duration-300">
          <div className="flex items-center">
            {!disabled && (
              <button
                onClick={() => setDisabled((prev) => !prev)}
                className="rounded-2xl hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600  dark:active:bg-gray-700 mx-1 cursor-pointer transition-all duration-300"
              >
                <SquarePen className="w-4 h-4 m-2" />
              </button>
            )}
            <input
              id="name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              autoComplete="none"
              disabled={!disabled}
              className={`text-2xl md:text-4xl font-semibold w-70 md:w-100 rounded-lg px-2 py-1 mr-2 transition-all duration-300 ${disabled ? "bg-white border border-gray-300 dark:bg-[#0000002c] shadow-md" : "bg-none"}`}
            />
          </div>
          <div className="flex items-center mt-5">
            {!disabled && (
              <button
                onClick={() => setDisabled((prev) => !prev)}
                className="rounded-2xl hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600  dark:active:bg-gray-700 mx-1 cursor-pointer"
              >
                <SquarePen className="w-4  h-4 m-2" />
              </button>
            )}
            <label htmlFor="description" className="font-semibold">
              Description:
            </label>
          </div>
          <div className={`${!disabled ? "pl-5" : ""}`}>
            <textarea
              id="description"
              ref={textareaRef}
              value={form.description}
              onChange={handleDescriptionChange}
              autoComplete="none"
              disabled={!disabled}
              className={`px-2 py-2 w-full min-h-20 max-w-100 md:max-w-120 text-xs md:text-base indent-8 resize-none rounded-lg transition-all duration-300 ${disabled ? "bg-white border shadow-md border-gray-300 dark:bg-[#0000002c] ml-3" : "bg-none"}`}
            />
          </div>
          <div className="flex items-center">
            {!disabled && (
              <button
                onClick={() => setDisabled((prev) => !prev)}
                className="rounded-2xl hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600  dark:active:bg-gray-700 mx-1 cursor-pointer"
              >
                <SquarePen className="w-4 h-4 m-2" />
              </button>
            )}

            <Category
              otherCategory={otherCategory}
              setOtherCategory={setOtherCategory}
              disabled={disabled}
              setForm={setForm}
              category={form.category}
            />
          </div>

          {disabled && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="shadow-sm text-xs md:text-base flex items-center justify-center bg-gray-300 hover:bg-gray-400 active:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-900 px-3 py-2 rounded-2xl font-semibold cursor-pointer"
              >
                <Ban className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleChangeDetails}
                className="shadow-sm flex items-center justify-center text-xs md:text-base bg-green-300 hover:bg-green-400 active:bg-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:active:bg-green-900 px-3 py-2 rounded-2xl font-semibold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>
        <div className="w-full sm:w-100 md:w-130 transition-all duration-300 mt-2">
          <Sizes
            sizes={form.sizes ?? []}
            setSizes={(newSizes) =>
              setForm((prev) => ({
                ...prev,
                sizes: newSizes,
              }))
            }
            onCancel={() =>
              setForm((prev) => ({
                ...prev,
                sizes: product?.sizes,
              }))
            }
            id={id.toString()}
          />
        </div>
        <div
          className={`relative ${isSidebarCollapsed ? "lg:absolute" : ""} xl:absolute flex justify-center md:top-0 md:right-0 w-full sm:w-100 md:w-130 lg:w-100 mt-5 transition-all duration-300`}
        >
          <ImageSection images={form.images || []} productId={form.id} />
        </div>
      </div>
      {product?.reviews?.length === 0 ? (
        ""
      ) : (
        <div className="w-full flex justify-start mt-5">
          <CommentSection reviews={product?.reviews} />
        </div>
      )}
    </>
  );

  return isLoading ? (
    <div className="h-[85vh]">
      <Spinner />
    </div>
  ) : isError ? (
    <>
      <div className="h-[85vh]">
        <h4 className="text-red-400">Error fetching Product</h4>
      </div>
    </>
  ) : (
    content
  );
}
