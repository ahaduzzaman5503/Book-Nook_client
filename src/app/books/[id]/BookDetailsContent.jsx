"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";
import Image from "next/image";

const BookDetailsContent = ({ book }) => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [message, setMessage] = useState("");

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f7f3]">
        <p className="text-gray-500">Loading book details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f7f3] px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-4xl">🔒</p>
          <h2 className="mt-4 text-2xl font-bold text-[#263b32]">
            Login Required
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please log in to view book details.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-xl bg-[#263b32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#385744]"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const availableCopies = Number(book.availableCopies ?? 0);
  const totalCopies = Number(book.totalCopies ?? 0);

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/books"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#56745c] transition hover:text-[#263b32]"
        >
          ← Back to Books
        </Link>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="grid md:grid-cols-2">
            <div className="flex items-center justify-center bg-[#f1f2eb] p-8 sm:p-12">
              <div className="h-[300px] w-[210px] overflow-hidden rounded-xl shadow-xl sm:h-[380px] sm:w-[260px]">
                <Image
                  width={500}
                  height={500}
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-9">
              <span className="w-fit rounded-full bg-[#e8eee8] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#385744]">
                {book.category}
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight text-[#263b32] sm:text-4xl">
                {book.title}
              </h1>

              <p className="mt-3 text-base text-gray-500">
                By{" "}
                <span className="font-semibold text-gray-700">
                  {book.author}
                </span>
              </p>

              <div className="my-6 border-t border-gray-100" />

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#f8f7f3] p-4">
                  <p className="text-xs text-gray-500">Total Copies</p>
                  <p className="mt-1 text-2xl font-bold text-[#263b32]">
                    {totalCopies}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f8f7f3] p-4">
                  <p className="text-xs text-gray-500">Available Copies</p>
                  <p
                    className={`mt-1 text-2xl font-bold ${
                      availableCopies > 0 ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {availableCopies}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Added to BookNook by
                </p>
                <p className="mt-2 font-semibold text-[#263b32]">
                  {book.addedBy?.name || "Unknown"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {book.addedBy?.email || ""}
                </p>
              </div>

              <button
                type="button"
                disabled={availableCopies < 1}
                onClick={() =>
                  setMessage(
                    "Borrow functionality will be connected in the next step.",
                  )
                }
                className="mt-7 w-full rounded-xl bg-[#263b32] px-6 py-3.5 font-semibold text-white transition hover:bg-[#385744] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {availableCopies > 0
                  ? "Borrow This Book"
                  : "Currently Unavailable"}
              </button>
              <br />
              <Link href="/books" className="btn">
                Back to all Books
              </Link>

              {message && (
                <p className="mt-3 text-center text-sm text-gray-500">
                  {message}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 p-6 sm:p-9">
            <h2 className="text-xl font-bold text-[#263b32]">
              About This Book
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-gray-600">
              {book.description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookDetailsContent;
