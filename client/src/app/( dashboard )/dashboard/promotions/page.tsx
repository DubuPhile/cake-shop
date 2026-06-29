"use client";

import { useState } from "react";
import PromoBannerModal from "../../(dashboardComponents)/PromoBannerModal";

export default function Promotions() {
  const [createBannerModal, setCreateBannerModal] = useState<boolean>(false);
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
        />
      )}
    </div>
  );
}
