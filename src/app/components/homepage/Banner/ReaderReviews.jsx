import Image from 'next/image';

const ReaderReviews = async () => {

    const res = await fetch('http://localhost:5000/reviewsdata', {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch reader reviews');
    }

    const reviews = await res.json();

    return (
        <section className="bg-white py-20 px-5 md:px-10">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-14">
                    <p className="text-sm uppercase tracking-[3px] text-green-700 font-semibold mb-3">
                        Community Voices
                    </p>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        What Our Readers Say
                    </h2>

                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        Discover what readers think about their experience
                        with BookNook.
                    </p>
                </div>

                {reviews.length === 0 ? (
                    <p className="text-center py-12 text-gray-600">
                        No reviews available yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <div
                                key={review._id || index}
                                className="bg-[#f8f7f2] rounded-2xl p-8 shadow-sm hover:shadow-lg transition duration-300"
                            >
                                <div className="text-yellow-500 text-xl mb-5">
                                    {'★'.repeat(review.rating)}
                                </div>

                                <p className="text-gray-600 leading-relaxed mb-8">
                                    "{review.review}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <Image
                                        src={review.image}
                                        alt={review.name}
                                        width={55}
                                        height={55}
                                        className="w-14 h-14 rounded-full object-cover"
                                    />

                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {review.name}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {review.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
};

export default ReaderReviews;