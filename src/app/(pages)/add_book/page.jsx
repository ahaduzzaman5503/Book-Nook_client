'use client';
import { useState } from 'react';
import { authClient } from '../../../lib/auth-client';
import { toast, Toaster } from 'react-hot-toast';

const AddBookPage = () => {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState({
        type: '',
        text: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        setImageFile(file || null);
        setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setMessage({ type: '', text: '' });

        if (!user) {
            setMessage({
                type: 'error',
                text: 'Please log in before adding a book.'
            });
            return;
        }

        if (!imageFile) {
            setMessage({
                type: 'error',
                text: 'Please select a book image.'
            });
            return;
        }
        setLoading(true);

        try {
            const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

            if (!apiKey) {
                throw new Error(
                    'ImgBB API key is missing. Check your .env.local file.'
                );
            }

            const imageData = new FormData();
            imageData.append('image', imageFile);

            const imageResponse = await fetch(
                `https://api.imgbb.com/1/upload?key=${apiKey}`,
                {
                    method: 'POST',
                    body: imageData
                }
            );

            const imageResult = await imageResponse.json();

            if (!imageResponse.ok || !imageResult.success) {
                console.error('ImgBB Error:', imageResult);

                throw new Error(
                    imageResult.error?.message ||
                    'Image upload failed. Please try again.'
                );
            }

            const imageUrl = imageResult.data.url;

            console.log('Image uploaded successfully:', imageUrl);

            const bookData = {
                title: form.elements.title.value.trim(),
                author: form.elements.author.value.trim(),
                category: form.elements.category.value,
                image: imageUrl,
                description: form.elements.description.value.trim(),
                totalCopies: Number(form.elements.totalCopies.value),
                name: user.name,
                email: user.email
            };

            const response = await fetch(
                'http://localhost:5000/all_books',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookData)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Failed to add book.'
                );
            }

            // Step 5: Show success message
            setMessage({
                type: 'success',
                text: toast.success('Book added successfully to BookNook!')
            });

            form.reset();
            setImageFile(null);

        } catch (error) {
            console.error('Add Book Error:', error);

            setMessage({
                type: 'error',
                text: error.message || 'Something went wrong.'
            });

        } finally {
            setLoading(false);
        }
    };

    // Session loading
    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    // User authentication check
    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-red-500">
                    Please log in to add a book.
                </p>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#f8f7f3] px-4 py-7 sm:px-6">
            <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-5 shadow-md sm:p-7">
                <div className="mb-7 text-center">
                    <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
                        BOOKNOOK LIBRARY
                    </span>

                    <h1 className="mt-4 text-2xl font-bold text-[#263b32] sm:text-3xl">
                        Add a New Book
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Add a new book to the BookNook library.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Book Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            placeholder="Enter book title"
                            required
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Author Name
                        </label>

                        <input
                            type="text"
                            name="author"
                            placeholder="Enter author name"
                            required
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white"
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Category
                            </label>

                            <select
                                name="category"
                                required
                                defaultValue=""
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-green-600"
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                <option value="Fiction">Fiction</option>
                                <option value="Science">Science</option>
                                <option value="History">History</option>
                                <option value="Kids">Kids</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Total Copies
                            </label>

                            <input
                                type="number"
                                name="totalCopies"
                                min="1"
                                placeholder="Enter number of copies"
                                required
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-green-600"
                            />
                        </div>

                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Book Cover Image
                        </label>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            required
                            onChange={handleImageChange}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm"
                        />

                        {imageFile && (
                            <p className="mt-2 text-sm text-green-700">
                                Selected: {imageFile.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Book Description
                        </label>

                        <textarea
                            name="description"
                            rows="4"
                            placeholder="Write a short description about this book..."
                            required
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white"
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Added By
                            </label>

                            <input
                                type="text"
                                value={user.name || ''}
                                readOnly
                                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={user.email || ''}
                                readOnly
                                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500"
                            />
                        </div>

                    </div>

                    {message.text && (
                        <div
                            role="status"
                            className={`rounded-xl p-3 text-center text-sm font-medium ${
                                message.type === 'success'
                                    ? 'border border-green-200 bg-green-50 text-green-700'
                                    : 'border border-red-200 bg-red-50 text-red-700'
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#263b32] px-6 py-3 font-semibold text-white transition hover:bg-[#385744] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Adding Book...' : '＋ Add Book'}
                    </button>
                </form>
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
        </section>
    );
};

export default AddBookPage;

