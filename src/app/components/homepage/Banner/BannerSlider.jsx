"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    subtitle: "WELCOME TO BOOKNOOK",
    title: "Discover Your Next Favorite Book",
    description:
      "Explore thousands of amazing books and find stories that inspire, entertain, and change the way you see the world.",
    image: "/images/banner-1.jpg",
  },
  {
    id: 2,
    subtitle: "EXPLORE NEW WORLDS",
    title: "Every Book Opens a New Adventure",
    description:
      "From exciting adventures to inspiring stories, discover books that take your imagination beyond boundaries.",
    image: "/images/banner-2.jpg",
  },
  {
    id: 3,
    subtitle: "YOUR READING JOURNEY",
    title: "A Perfect Book Is Waiting for You",
    description:
      "Build your personal collection, discover new authors, and become part of our growing reading community.",
    image: "/images/banner-3.jpg",
  },
];

const BannerSlider = () => {
  return (
    <section className="px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl shadow-xl">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          loop={true}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          className="booknook-slider"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="relative flex min-h-[430px] items-center bg-cover bg-center px-7 py-16 sm:min-h-[500px] sm:px-14 lg:px-20"
                style={{
                  backgroundImage: `
                    linear-gradient(
                      90deg,
                      rgba(3, 35, 23, 0.95) 0%,
                      rgba(3, 35, 23, 0.78) 55%,
                      rgba(3, 35, 23, 0.25) 100%
                    ),
                    url('${slide.image}')
                  `,
                }}
              >
                <div className="relative z-10 max-w-2xl text-white">
                  <span className="mb-5 inline-block rounded-full border border-[#e9b94f]/50 bg-[#e9b94f]/10 px-4 py-2 text-xs font-bold tracking-[3px] text-[#e9b94f]">
                    {slide.subtitle}
                  </span>

                  <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                    {slide.description}
                  </p>

                  <Link
                    href="/all_books"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#e9b94f] px-7 py-3.5 font-semibold text-[#173d2a] transition duration-300 hover:bg-[#f3ca6b] hover:shadow-lg"
                  >
                    Browse Books
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full border border-[#e9b94f]/30 sm:h-80 sm:w-80" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BannerSlider;
