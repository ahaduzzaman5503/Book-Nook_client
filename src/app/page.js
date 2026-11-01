import Banner from "./components/homepage/Banner/BannerSlider";
import HowBorrowingWorks from "./components/homepage/Banner/HowBorrowingWorks";
import NewArrivals from "./components/homepage/Banner/NewArrivals";
import ReaderReviews from "./components/homepage/Banner/ReaderReviews";
import WhyChooseBookNook from "./components/homepage/Banner/WhyChooseBookNook";

export default function Home() {
  return (
    <>
      <Banner />
      <NewArrivals />
      <HowBorrowingWorks />
      <WhyChooseBookNook />
      <ReaderReviews />
    </>
  );
}
