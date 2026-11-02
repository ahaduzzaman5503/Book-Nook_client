"use client";
import { authClient } from "../../../lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast, Toaster } from "react-hot-toast";
import { FaMoon } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";
import { useRouter } from "next/navigation";

const Navber = () => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    const loadingToast = toast.loading("সাইন আউট হচ্ছে...");
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("সাইন আউট ব্যর্থ হয়েছে", {
          id: loadingToast,
        });
        setIsSigningOut(false);
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে!", {
        id: loadingToast,
        duration: 1500,
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast.error("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।", {
        id: loadingToast,
      });
      setIsSigningOut(false);
    }
  };

  const { data: session } = authClient.useSession();
  const user = session?.user;
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm container mx-auto">
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
                <Link href="/books">All Books</Link>
              </li>
              {user ? (
                <li>
                  <Link href="/add_book">Add Book</Link>
                </li>
              ) : (
                ""
              )}
              {user ? (
                <li>
                  <Link href="/my_books">My Books</Link>
                </li>
              ) : (
                ""
              )}
              {user ? (
                <li>
                  <Link href="/my_borrows">My Borrows</Link>
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
          <div className="flex items-center justify-center gap-2 btn btn-ghos">
            <IoBookOutline className="rounded" size={20}></IoBookOutline>
            <Link href="/" className=" text-xl">
              BookNook
            </Link>
          </div>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/books">All Books</Link>
            </li>
            {user ? (
              <li>
                <Link href="/add_book">Add Book</Link>
              </li>
            ) : (
              ""
            )}
            {user ? (
              <li>
                <Link href="/my_books">My Books</Link>
              </li>
            ) : (
              ""
            )}
            {user ? (
              <li>
                <Link href="/my_borrows">My Borrows</Link>
              </li>
            ) : (
              ""
            )}
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
                    alt={user.name || "User profile"}
                    src={user.image || "/default-avatar.png"}
                  />
                </div>
              </div>
              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-40 p-2 shadow gap-3"
              >
                <li>
                  <a className="justify-between">UserName</a>
                </li>
                <li>
                  <Link href="/profile">My Profile</Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-active btn-secondary"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <button className="btn btn-neutral">Login</button>
              </Link>
              <Link href="/register">
                <button className="btn btn-primary">Register</button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#e8f8ee",
              color: "#079447",
            },
          },
          error: {
            style: {
              background: "#fff0f0",
              color: "#dc2626",
            },
          },
        }}
      />
    </>
  );
};

export default Navber;
