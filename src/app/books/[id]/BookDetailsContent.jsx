
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "../../../lib/auth-client";
import { toast, Toaster } from "react-hot-toast";

const BookDetailsContent = ({ book }) => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [showModal, setShowModal] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [checkingBorrow, setCheckingBorrow] = useState(true);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [borrowedOnce, setBorrowedOnce] = useState(false);

  const [availableCopies, setAvailableCopies] = useState(
    Number(book.availableCopies ?? 0)
  );

  useEffect(() => {
    if (isPending) return;

    if (!user?.email) {
      setCheckingBorrow(false);
      return;
    }

    let ignore = false;

    const checkBorrow = async () => {
      setCheckingBorrow(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/borrows?email=${encodeURIComponent(user.email)}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Could not check your borrow records.");
        }

        const borrows = await response.json();

        if (!ignore) {
          const found = borrows.some(
            (borrow) => String(borrow.bookId) === String(book._id)
          );

          setAlreadyBorrowed(found);
        }
      } catch (error) {
        console.error("Borrow Check Error:", error);
      } finally {
        if (!ignore) {
          setCheckingBorrow(false);
        }
      }
    };

    checkBorrow();

    return () => {
      ignore = true;
    };
  }, [user?.email, isPending, book._id]);

  const handleBorrowClick = () => {
    if (borrowedOnce || alreadyBorrowed) {
      toast.error("You have already borrowed this book!");
      return;
    }

    if (availableCopies < 1) {
      toast.error("This book is currently unavailable.");
      return;
    }

    // First click opens the confirmation modal.
    setShowModal(true);
  };

  // Handle confirmation modal submission.
  const handleBorrow = async (e) => {
    e.preventDefault();

    if (borrowing) return;

    if (!user?.email) {
      toast.error("Please log in before borrowing a book.");
      return;
    }

    if (borrowedOnce || alreadyBorrowed) {
      setShowModal(false);
      toast.error("You have already borrowed this book!");
      return;
    }

    if (availableCopies < 1) {
      toast.error("This book is currently unavailable.");
      return;
    }

    setBorrowing(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book._id,
          bookTitle: book.title,
          bookImage: book.image,
          userName: user.name,
          userEmail: user.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setAlreadyBorrowed(true);
          setShowModal(false);
          toast.error("You have already borrowed this book!");
          return;
        }

        throw new Error(result.message || "Failed to borrow this book.");
      }

      // Update available copies after successful borrowing.
      setAvailableCopies((previous) => Math.max(0, previous - 1));

      // Remember the successful borrow during this page visit.
      // Do not set alreadyBorrowed to true here.
      setBorrowedOnce(true);

      // Close confirmation modal.
      setShowModal(false);

      // Show success toast.
      toast.success("Book borrowed successfully!");

    } catch (error) {
      console.error("Borrow Book Error:", error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setBorrowing(false);
    }
  };

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

  const totalCopies = Number(book.totalCopies ?? 0);

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-4 py-10 sm:px-6">
      <Toaster position="top-right" />

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
              <div className="relative h-[300px] w-[210px] overflow-hidden rounded-xl shadow-xl sm:h-[380px] sm:w-[260px]">
                <Image
                  fill
                  src={book.image}
                  alt={book.title}
                  sizes="(max-width: 768px) 210px, 260px"
                  className="object-cover"
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
                disabled={
                  checkingBorrow ||
                  borrowing ||
                  (availableCopies < 1 && !borrowedOnce && !alreadyBorrowed)
                }
                onClick={handleBorrowClick}
                className="mt-7 w-full rounded-xl bg-[#263b32] px-6 py-3.5 font-semibold text-white transition hover:bg-[#385744] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {checkingBorrow
                  ? "Checking..."
                  : availableCopies < 1 &&
                    !borrowedOnce &&
                    !alreadyBorrowed
                  ? "Currently Unavailable"
                  : "Borrow This Book"}
              </button>

              {alreadyBorrowed && (
                <p className="mt-3 text-center text-sm text-red-700 bg-gray-300 font-bold border rounded-2xl">
                  You have already borrowed this book.
                </p>
              )}

              <Link
                href="/books"
                className="mt-4 text-center text-sm font-semibold text-[#56745c] hover:text-[#263b32]"
              >
                Back to All Books
              </Link>
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

      {/* Borrow Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <h2 className="text-2xl font-bold text-[#263b32]">
              Confirm Your Borrow
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Please review your information before borrowing this book.
            </p>

            <form onSubmit={handleBorrow} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Book Title
                </label>

                <input
                  value={book.title}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Name
                </label>

                <input
                  value={user.name || ""}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Email
                </label>

                <input
                  type="email"
                  value={user.email || ""}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  disabled={borrowing}
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={borrowing}
                  className="flex-1 rounded-xl bg-[#263b32] px-4 py-3 text-sm font-semibold text-white hover:bg-[#385744] disabled:opacity-60"
                >
                  {borrowing ? "Borrowing..." : "Confirm Borrow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default BookDetailsContent;

