"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import { toast, Toaster } from "react-hot-toast";

const MyBooksPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    category: "",
    image: "",
    description: "",
    totalCopies: 1,
  });

  // Fetch books added by the logged-in user
  useEffect(() => {
    if (isPending) return;

    if (!user?.email) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const fetchMyBooks = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-books?email=${encodeURIComponent(user.email)}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch your books.");
        }

        const data = await response.json();

        if (!ignore) {
          setBooks(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("My Books Error:", error);
        if (!ignore) {
          toast.error(error.message || "Unable to load your books.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchMyBooks();

    return () => {
      ignore = true;
    };
  }, [user?.email, isPending]);

  // Open edit modal
  const handleEdit = (book) => {
    setSelectedBook(book);

    setEditForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      image: book.image || "",
      description: book.description || "",
      totalCopies: book.totalCopies || 1,
    });
  };

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: name === "totalCopies" ? value : value,
    }));
  };

  // Save edited book
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedBook || saving) return;

    setSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${selectedBook._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editForm,
            totalCopies: Number(editForm.totalCopies),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update book.");
      }

      setBooks((previous) =>
        previous.map((book) =>
          String(book._id) === String(selectedBook._id)
            ? {
                ...book,
                ...editForm,
                totalCopies: Number(editForm.totalCopies),
                availableCopies:
                  result.availableCopies ?? book.availableCopies,
              }
            : book
        )
      );

      setSelectedBook(null);
      toast.success("Book updated successfully!");
    } catch (error) {
      console.error("Update Book Error:", error);
      toast.error(error.message || "Unable to update book.");
    } finally {
      setSaving(false);
    }
  };

  // Delete book
  const handleDelete = async () => {
    if (!deleteBook) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${deleteBook._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete book.");
      }

      setBooks((previous) =>
        previous.filter(
          (book) => String(book._id) !== String(deleteBook._id)
        )
      );

      setDeleteBook(null);
      toast.success("Book deleted successfully!");
    } catch (error) {
      console.error("Delete Book Error:", error);
      toast.error(error.message || "Unable to delete book.");
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7f3]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-[#263b32]" />
          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading your books...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7f3] px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-md">
          <h2 className="text-xl font-bold text-[#263b32]">
            Please log in
          </h2>
          <p className="mt-2 text-gray-500">
            Log in to manage the books you have added.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-xl bg-[#263b32] px-6 py-3 font-semibold text-white hover:bg-[#385744]"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f7f3] px-4 py-10 sm:px-6">
      <Toaster
        position="top-right"
        toastOptions={{ duration: 2500 }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
              BOOKNOOK LIBRARY
            </span>

            <h1 className="mt-4 text-3xl font-bold text-[#263b32]">
              My Books
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage the books you have added to BookNook.
            </p>
          </div>

          <Link
            href="/add_book"
            className="rounded-xl bg-[#263b32] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#385744]"
          >
            + Add New Book
          </Link>
        </div>

        {/* Book Count */}
        <div className="mb-6 rounded-xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Books Added</p>
          <p className="mt-1 text-3xl font-bold text-[#263b32]">
            {books.length}
          </p>
        </div>

        {/* Empty State */}
        {books.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm">
            <div className="text-5xl">📚</div>

            <h2 className="mt-5 text-xl font-bold text-[#263b32]">
              You haven't added any books yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Start building your library by adding your first book.
            </p>

            <Link
              href="/add_book"
              className="mt-6 inline-block rounded-xl bg-[#263b32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#385744]"
            >
              Add Your First Book
            </Link>
          </div>
        ) : (
          /* Books Table */
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#263b32] text-sm text-white">
                  <tr>
                    <th className="px-5 py-4">Book</th>
                    <th className="px-5 py-4">Author</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Copies</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {books.map((book) => (
                    <tr
                      key={book._id}
                      className="transition hover:bg-green-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="h-16 w-12 rounded-lg object-cover"
                          />
                          <span className="font-semibold text-[#263b32]">
                            {book.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {book.author}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                          {book.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        <p>Total: {book.totalCopies}</p>
                        <p className="mt-1 text-green-700">
                          Available: {book.availableCopies}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => setDeleteBook(book)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#263b32]">
                Edit Book
              </h2>

              <button
                onClick={() => setSelectedBook(null)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Book Title
                </label>
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Author
                </label>
                <input
                  name="author"
                  value={editForm.author}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Kids">Kids</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Total Copies
                  </label>
                  <input
                    type="number"
                    name="totalCopies"
                    min="1"
                    value={editForm.totalCopies}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Image URL
                </label>
                <input
                  name="image"
                  type="url"
                  value={editForm.image}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={editForm.description}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#263b32] px-4 py-3 text-sm font-semibold text-white hover:bg-[#385744] disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-xl">
            <div className="text-4xl">🗑️</div>

            <h2 className="mt-4 text-xl font-bold text-[#263b32]">
              Delete This Book?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {deleteBook.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setDeleteBook(null)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyBooksPage;

