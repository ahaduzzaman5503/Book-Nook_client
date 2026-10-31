import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaMoon } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";

const Navber = () => {
  const user = true;
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                aria-label="Menu"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="all-books">All Books</Link>
              </li>
              <li>
                <Link href="/add-book">Add Book</Link>
              </li>
              <li>
                <Link href="my-books">My Books</Link>
              </li>
              <li>
                <Link href="my-borrows">My Borrows</Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center gap-2 btn btn-ghos">
            <IoBookOutline className="rounded" size={20}></IoBookOutline>
            <a className=" text-xl">BookNook</a>
          </div>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="all-books">All Books</Link>
            </li>
            <li>
              <Link href="/add-book">Add Book</Link>
            </li>
            <li>
              <Link href="my-books">My Books</Link>
            </li>
            <li>
              <Link href="my-borrows">My Borrows</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-4">
          <label className="swap swap-rotate">
            <input type="checkbox" className="theme-controller" value="dark" />
            <MdOutlineWbSunny className="swap-off" size={25} />
            <FaMoon className="swap-on" size={25} />
          </label>

          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <Image
                    width={500}
                    height={500}
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-40 p-2 shadow"
              >
                <li>
                  <a className="justify-between">UserName</a>
                </li>
                <li>
                  <a>My Profile</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <button className="btn btn-neutral">Login</button>
              <button className="btn btn-primary">Register</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navber;
