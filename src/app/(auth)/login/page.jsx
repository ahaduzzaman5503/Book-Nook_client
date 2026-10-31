"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "../../../lib/auth-client";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { validatePassword } from "../../../lib/passwordValidation";

const LoginPage = () => {
  const router = useRouter();

  const [passwordError, setPasswordError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const error = validatePassword(password);

    setPasswordError(error);
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const error = validatePassword(user.password);

    if (error) {
      setPasswordError(error);
      return;
    }

    setPasswordError("");

    const loadingToast = toast.loading("Logging in...");
    setIsLoggingIn(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: user.email,
        password: user.password,
        callbackURL: "/",
      });

      console.log("Login result:", data);

      if (error) {
        toast.error(error.message, {
          id: loadingToast,
        });

        setIsLoggingIn(false);
        return;
      }

      toast.success("Login successful!", {
        id: loadingToast,
        duration: 1500,
      });

      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);

      toast.error("Something went wrong!", {
        id: loadingToast,
      });

      setIsLoggingIn(false);
    }
  };

  const googleSignIn = async () => {
    const loadingToast = toast.loading("Connecting to Google...");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google login failed", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Google login error:", error);

      toast.error("Something went wrong!", {
        id: loadingToast,
      });
    }
  };

  const readers = [
    "photo-1534528741775-53994a69daeb",
    "photo-1500648767791-00dcc994a43e",
    "photo-1506794778202-cad84cf45f1d",
  ];

  return (
    <div className="min-h-screen bg-[#faf7f0] p-4 sm:p-8 flex items-center justify-center">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl bg-[#fffdfa] shadow-xl md:grid-cols-2">
        <div
          className="relative flex min-h-[500px] flex-col justify-between overflow-hidden bg-cover bg-center p-7 text-white sm:p-10 lg:p-12"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(3, 35, 23, 0.84),
                rgba(3, 35, 23, 0.90)
              ),
              url('/images/library-bg.jpg')
            `,
          }}
        >
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <IoBookOutline size={38} className="text-[#e9b94f]" />

            <h2 className="font-serif text-3xl font-bold">BookNook</h2>
          </Link>

          <div className="relative z-10 my-auto py-12">
            <h1 className="font-serif text-5xl font-bold leading-tight sm:text-6xl">
              Welcome
              <br />
              <span className="italic text-[#e9b94f]">Back!</span>
            </h1>

            <p className="mt-6 max-w-sm text-base leading-7 text-white/85 sm:text-lg">
              Sign in to discover new books,
              <br />
              save your favourites and
              <br />
              be part of our reading community.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {readers.map((photo, index) => (
                  <Image
                    key={index}
                    width={80}
                    height={80}
                    unoptimized
                    src={`https://images.unsplash.com/${photo}?w=80&h=80&fit=crop&crop=faces`}
                    alt="Reader"
                    className="h-11 w-11 rounded-full border-2 border-[#d6c7a0] object-cover"
                  />
                ))}
              </div>

              <span className="rounded-full bg-[#d9a92f]/15 px-4 py-3 text-xs font-semibold text-[#efc75c] sm:text-sm">
                Join 10k+ readers
              </span>
            </div>
          </div>

          <div className="absolute -bottom-12 -left-8 h-20 w-64 rotate-[25deg] rounded-[50%] border-t-2 border-[#e9b94f]" />
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <h1 className="mb-8 text-center font-serif text-4xl font-bold text-[#241609] sm:text-5xl">
              Login
            </h1>

            <form onSubmit={handleEmailSignIn} className="space-y-5">
              <fieldset className="fieldset">
                <label className="label mb-1 text-sm font-semibold text-[#241609]">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="input h-12 w-full rounded-lg border-[#e5d9c8] bg-transparent px-4 text-[#241609] outline-none focus:border-[#205338] focus:outline-none"
                />

                <label className="label mb-1 mt-3 text-sm font-semibold text-[#241609]">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="Enter your password"
                  onChange={handlePasswordChange}
                  className={`input h-12 w-full rounded-lg border bg-transparent px-4 text-[#241609] outline-none focus:outline-none ${
                    passwordError
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#e5d9c8] focus:border-[#205338]"
                  }`}
                />

                {passwordError && (
                  <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                )}

                <div className="mt-3 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-[#205338] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="btn mt-5 h-12 w-full rounded-lg border-none bg-[#205338] text-base font-semibold text-white transition hover:bg-[#17432c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingIn ? "Logging in..." : "Login"}
                </button>
              </fieldset>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#e5d9c8]" />
              <span className="text-sm text-gray-500">OR</span>
              <div className="h-px flex-1 bg-[#e5d9c8]" />
            </div>

            <button
              type="button"
              onClick={googleSignIn}
              disabled={isLoggingIn}
              className="btn h-12 w-full rounded-lg border border-[#e5d9c8] bg-transparent text-sm font-semibold text-[#241609] shadow-none transition hover:bg-[#f8f3e9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaGoogle className="text-lg text-[#4285F4]" />
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-gray-500">
              New here?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#205338] hover:underline"
              >
                Register an account
              </Link>
            </p>
          </div>
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
    </div>
  );
};

export default LoginPage;
