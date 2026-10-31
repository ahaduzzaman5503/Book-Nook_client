"use client";

import {
  FaBookOpen,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-300 text-black">
      <div className="mx-auto grid max-w-[1020px] grid-cols-1 gap-10 px-6 py-12 md:grid-cols-3 md:gap-16">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#20563b] text-white">
              <FaBookOpen size={20} />
            </div>
            <h2 className="font-serif text-2xl font-bold">BookNook</h2>
          </div>

          <p className="max-w-[300px] text-sm leading-[21px] text-[#76695e]">
            A small neighbourhood library on the web. Share the books on your
            shelf and borrow the ones you have been meaning to read.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-xl font-bold">Contact</h3>

          <div className="flex flex-col gap-3 text-sm text-[#76695e]">
            <a
              href="mailto:hello@booknook.app"
              className="flex items-center gap-2 hover:text-[#20563b]"
            >
              <FaEnvelope size={15} />
              hello@booknook.app
            </a>

            <a
              href="tel:+8801700000000"
              className="flex items-center gap-2 hover:text-[#20563b]"
            >
              <FaPhone size={15} />
              +880 1700 000 000
            </a>

            <div className="flex items-center gap-2">
              <FaLocationDot size={15} />
              12 Reading Lane, Dhaka
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-xl font-bold">Follow us</h3>

          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="X"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ded3c1] bg-[#faf6ee] transition hover:bg-[#20563b] hover:text-white"
            >
              <FaXTwitter size={16} />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ded3c1] bg-[#faf6ee] transition hover:bg-[#20563b] hover:text-white"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ded3c1] bg-[#faf6ee] transition hover:bg-[#20563b] hover:text-white"
            >
              <FaInstagram size={17} />
            </a>
          </div>
        </div>
      </div>
      <div className="divider divider-start"></div>

      <div className="border-t border-[#e2d7c5] px-4 py-5 text-center">
        <p className="text-sm text-[#76695e]">
          © {new Date().getFullYear()} BookNook. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
