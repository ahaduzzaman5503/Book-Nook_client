"use client";

import dynamic from "next/dynamic";

const BannerSliderClient = dynamic(
  () => import("./BannerSliderClient"),
  {
    ssr: false,
    loading: () => (
      <section className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto min-h-[430px] max-w-7xl animate-pulse overflow-hidden rounded-2xl bg-gray-200 sm:min-h-[500px]" />
      </section>
    ),
  }
);

export default function BannerSlider() {
  return <BannerSliderClient />;
}

