"use client";

import { AdjustableYImage } from "@/app/(components)/DraggableImage";
import { useEffect, useState } from "react";
import Header from "../Header";
import { CircleX } from "lucide-react";
import RangeCalendar from "@/app/(components)/RangeCalendar";
import Spinner from "@/app/(components)/Spinner";
import AdSlider from "@/app/(components)/AdsSection";
import { BannerForm } from "@/redux/features/bannerSlice";

type Props = {
  onClose: () => void;
  isOpen: Boolean;
  onSubmit: (value: FormData) => Promise<void>;
};

export default function PromoBannerModal({ onClose, isOpen, onSubmit }: Props) {
  const [offsetY, setOffsetY] = useState<number>(0);
  const [imgBanner, setImgBanner] = useState<File>();
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<BannerForm>({
    title: "",
    description: "",
    CTA: "",
    startDate: null,
    endDate: null,
    link: "",
  });

  const ImgUrl =
    imgBanner instanceof File ? URL.createObjectURL(imgBanner) : "";

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (form.startDate === null || form.endDate === null) return;
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("cta", form.CTA);
      if (form.link) formData.append("link", form.link);
      formData.append("startDate", form.startDate.toISOString());
      formData.append("endDate", form.endDate.toISOString());
      formData.append("offsetY", offsetY.toString());
      if (imgBanner) {
        formData.append("images", imgBanner);
      }
      setLoading(true);
      await onSubmit(formData);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

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

  const labelCSS =
    "block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 font-semibold my-2";
  const inputCSS =
    "block w-[80%] md:w-full max-w-100 mb-2 p-2 border-gray-300 border rounded-md text-xs md:text-base";

  return (
    <div
      className={`fixed inset-0 bg-[rgba(0,0,0,0.2)] backdrop-blur flex items-center justify-center h-full w-full z-50 transition-all duration-500 ${show ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`relative bg-white dark:bg-gray-700 w-[90%] max-h-[90vh] overflow-y-auto transition-all duration-500 rounded-md ${
          show ? "scale-100 translate-y-0 " : "scale-95 translate-y-4 "
        }`}
      >
        <div className="sticky top-0 bg-gray-100 dark:bg-gray-700 rounded-t-md py-3 px-3 drop-shadow-lg z-10">
          <Header name="Create Banner" />
          <button
            onClick={handleClose}
            className="absolute top-0 right-0 mx-4 my-4 cursor-pointer rounded-full"
          >
            <CircleX className="w-4 h-4 md:w-7 md:h-7 text-gray-800 hover:bg-red-400 rounded-full" />
          </button>
        </div>

        <div className="flex flex-col items-center m-2">
          <div className="w-full max-w-200">
            <AdSlider
              banner={[{ ...form, offsetY, image: [{ url: ImgUrl }] }]}
            />
          </div>

          <form
            className="relative p-2 pl-4 w-full max-w-200 mt-4"
            onSubmit={handleSubmit}
          >
            <label htmlFor="title" className={labelCSS}>
              Title:
            </label>
            <input
              id="title"
              type="text"
              autoComplete="off"
              placeholder="ex. Summer Sale"
              onChange={handleChange}
              value={form.title}
              className={inputCSS}
              required
            />
            <h4 className={labelCSS}>Background:</h4>
            <div className="w-full aspect-2100/400">
              <AdjustableYImage
                setOffsetY={setOffsetY}
                setImgBanner={setImgBanner}
              />
            </div>
            <div className="md:flex gap-27">
              <div>
                <label htmlFor="CTA" className={labelCSS}>
                  Call To Action:
                </label>
                <input
                  id="CTA"
                  type="text"
                  autoComplete="off"
                  placeholder="ex. Buy now"
                  onChange={handleChange}
                  value={form.CTA}
                  className={inputCSS}
                  required
                />
                <label htmlFor="link" className={labelCSS}>
                  Link:
                </label>
                <input
                  id="link"
                  name="link"
                  type="text"
                  placeholder="/products"
                  value={form.link}
                  onChange={handleChange}
                  className={inputCSS}
                />
                <label htmlFor="description" className={labelCSS}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  autoComplete="off"
                  placeholder="Description..."
                  onChange={handleChange}
                  value={form.description}
                  className="w-[80%] h-25 md:w-75 lg:w-100 md:h-40 p-3 resize-none border rounded-lg border-gray-300 text-xs md:text-base"
                  required
                />
              </div>
              <div>
                <h4 className={labelCSS}>Choose Range Date:</h4>

                <div className=" scale-70 md:scale-100 transition-all duration-300 -translate-y-10 -translate-x-12 md:translate-y-0 md:translate-x-0">
                  <RangeCalendar
                    setEndDate={(value) =>
                      setForm((prev) => ({ ...prev, endDate: value }))
                    }
                    setStartDate={(value) =>
                      setForm((prev) => ({ ...prev, startDate: value }))
                    }
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="my-2 absolute bottom-0 md:bottom-auto md:top-0 right-0 lg:right-5 bg-green-300 hover:bg-green-400 active:bg-green-500 px-4 py-2 rounded-2xl text-xs md:text-sm font-semibold drop-shadow-lg cursor-pointer text-gray-700 mr-auto"
            >
              {loading ? (
                <Spinner classnames="w-6 h-6 mx-4" />
              ) : (
                "Create Banner"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
