import { Suspense } from "react";

import Banner from "./components/homepage/Banner/BannerSlider";
import HowBorrowingWorks from "./components/homepage/Banner/HowBorrowingWorks";
import NewArrivals from "./components/homepage/Banner/NewArrivals";
import ReaderReviews from "./components/homepage/Banner/ReaderReviews";
import WhyChooseBookNook from "./components/homepage/Banner/WhyChooseBookNook";

export default function Home() {
  return (
    <>
      <Banner />

      <Suspense fallback={<p className="text-center py-10">Loading new arrivals...</p>}>
        <NewArrivals />
      </Suspense>

      <HowBorrowingWorks />

      <Suspense fallback={<p className="text-center py-10">Loading features...</p>}>
        <WhyChooseBookNook />
      </Suspense>

      <Suspense fallback={<p className="text-center py-10">Loading reader reviews...</p>}>
        <ReaderReviews />
      </Suspense>
    </>
  );
}
