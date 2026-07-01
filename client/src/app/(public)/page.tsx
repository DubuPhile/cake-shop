"use client";

import AdSlider from "../(components)/AdsSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../(components)/ui/accordion";
import { useGetBannerQuery } from "@/redux/features/bannerSlice";

export default function Home() {
  const { data: banner } = useGetBannerQuery();

  const now = new Date();

  const visibleBanner = banner?.filter((item) => {
    if (!item.startDate || !item.endDate) return false;
    return new Date(item.startDate) <= now && new Date(item.endDate) >= now;
  });

  return (
    <main className="flex flex-col items-center">
      <div className=" w-full max-w-7xl">
        <AdSlider banner={visibleBanner} />

        <div className="w-full md:w-100">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>What is React?</AccordionTrigger>

              <AccordionContent>
                React is a JavaScript library for building user interfaces.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What is Next.js?</AccordionTrigger>

              <AccordionContent>
                Next.js is a React framework for production applications.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* <CreateProductModal /> */}
    </main>
  );
}
