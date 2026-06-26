"use client";

import { StaticImageData } from "next/image";
import { useState } from "react";
import Jill from "../../../../../public/jill.jpg";
import { CoverEditor } from "@/app/(components)/DraggableImage";

type Ad = {
  id: number;
  title: string;
  description: string;
  image: string | StaticImageData;
  x: number;
  y: number;
};

const ads: Ad[] = [
  {
    id: 3,
    title: "SUMMER SALE",
    description: "Up to 50% off selected items.",
    image: Jill,
    x: 0,
    y: 0,
  },
];

export default function Promotions() {
  const [offsetY, setOffsetY] = useState<number>(0);
  const [imgBanner, setImgBanner] = useState<File>();

  console.log(offsetY, imgBanner);

  return (
    <div>
      <CoverEditor setOffsetY={setOffsetY} setImgBanner={setImgBanner} />
    </div>
  );
}
