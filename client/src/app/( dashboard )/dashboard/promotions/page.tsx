"use client";

import { useState } from "react";
import PromoBannerModal from "../../(dashboardComponents)/PromoBannerModal";
import { useCreateBannerMutation } from "@/redux/features/bannerSlice";
import toast from "react-hot-toast";

export default function Promotions() {
  const [createBannerModal, setCreateBannerModal] = useState<boolean>(false);
  const [createBanner] = useCreateBannerMutation();

  const handleCreateBanner = async (data: FormData) => {
    for (const [key, value] of data.entries()) {
      console.log(key, value);
    }
    try {
      await createBanner(data).unwrap();

      toast.success("Banner Created", {
        style: {
          fontWeight: "600",
          color: "green",
        },
      });
      setCreateBannerModal(false);
    } catch (err) {
      console.log(err);
      toast.error("Create Banner Failed", {
        style: {
          fontWeight: "600",
          color: "red",
        },
      });
    }
  };
  return (
    <div>
      <button
        onClick={() => setCreateBannerModal(true)}
        className="cursor-pointer"
      >
        Create Banner
      </button>
      {createBannerModal && (
        <PromoBannerModal
          isOpen={createBannerModal}
          onClose={() => setCreateBannerModal(false)}
          onSubmit={handleCreateBanner}
        />
      )}
    </div>
  );
}
