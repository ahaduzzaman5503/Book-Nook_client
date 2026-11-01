import Banner from "./components/homepage/Banner/BannerSlider";
import HowBorrowingWorks from "./components/homepage/Banner/HowBorrowingWorks";
import NewArrivals from "./components/homepage/Banner/NewArrivals";
import WhyChooseBookNook from "./components/homepage/Banner/WhyChooseBookNook";

export default function Home() {
  return (
    <>
      <Banner />
      <NewArrivals />
      <HowBorrowingWorks />
      <WhyChooseBookNook />
    </>
  );
}
