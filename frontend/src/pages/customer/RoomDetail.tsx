/* eslint-disable*/
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Room } from '../../types/Room';
import { getById } from '../../services/roomService';
import Header from '../../components/Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Review } from '../../types/Review';
import { getReviewsByRoomNumber } from '../../services/reviewService';

export default function RoomDetail() {
    const { id } = useParams<{ id: string }>();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [index, setIndex] = useState(0);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState<string | null>(null);

    // REVIEW STATS: count + average (uses optional "rating" on Review if present)
    const reviewStats = useMemo(() => {
        const count = reviews.length;
        const sum = reviews.reduce((s, r) => s + ((r as any).rating ?? 0), 0);
        const avg = count ? +(sum / count).toFixed(1) : 0;
        return { count, avg };
    }, [reviews]);

    const renderStars = (rating?: number) => {
        const r = Math.round(rating ?? 0);
        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${
                            i < r ? 'text-amber-400' : 'text-gray-200'
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.384 2.455a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.384 2.455c-.784.57-1.84-.197-1.54-1.118l1.286-3.967a1 1 0 00-.364-1.118L2.614 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69L9.049 2.927z" />
                    </svg>
                ))}
            </div>
        );
    };

    useEffect(() => {
        let mounted = true;
        if (id) {
            getById(id)
                .then((data) => mounted && setRoom(data))
                .catch(() => setError('Failed to fetch room'))
                .finally(() => mounted && setLoading(false));
        }
        return () => {
            mounted = false;
        };
    }, [id]);

    // fetch reviews for this room
    useEffect(() => {
        if (!id) return;
        let mounted = true;
        setReviewsLoading(true);
        setReviewsError(null);

        getReviewsByRoomNumber(id)
            .then((data) => {
                if (!mounted) return;
                setReviews(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                if (!mounted) return;
                setReviewsError(
                    (err as Error)?.message || 'Failed to load reviews',
                );
            })
            .finally(() => {
                if (!mounted) return;
                setReviewsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [id]);

    const images = useMemo(
        () => (room?.images && (room.images as string[])) || [],
        [room],
    );

    // Auto slide
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (images.length ? (i + 1) % images.length : 0));
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    if (loading) return <div className="p-8 text-center">Loading room…</div>;
    if (error)
        return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!room) return <div className="p-8 text-center">Room not found.</div>;

    // quick amenities array (moved out of JSX to avoid TSX parse issues)
    const quickAmenities = [
        'Premium bedding with goose down option',
        'Curated pillow menu',
        'Marble bathroom with rain shower',
        'In-room safe & minibar',
        'High-speed WiFi',
        'Complimentary breakfast',
    ];

    return (
        <div className="bg-white font-sans">
            <div className="fixed top-0 left-0 w-full z-[200]">
                <Header />
            </div>

            {/* HERO SECTION */}
            <div className="relative w-full h-[75vh] overflow-hidden ">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                    style={{
                        backgroundImage: `url(${
                            images[index] || '/placeholder.svg'
                        })`,
                    }}
                />

                {/* Left Arrow */}
                <button
                    onClick={() =>
                        setIndex((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1,
                        )
                    }
                    className="absolute left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 transition z-30"
                >
                    <ChevronLeft size={30} className="text-white" />
                </button>

                {/* Right Arrow */}
                <button
                    onClick={() =>
                        setIndex((prev) =>
                            images.length ? (prev + 1) % images.length : 0,
                        )
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 transition z-30"
                >
                    <ChevronRight size={30} className="text-white" />
                </button>
            </div>

            <div className="flex flex-col items-center mt-16 font-serif">
                <h1 className="text-3xl font-serif ">
                    Duplex One Bedroom Suite
                </h1>
                <p className="text-lg text-center font-serif ">
                    Experience contemporary comfort and breathtaking views
                    overlooking the Gulf in this generously sized 170 sqm Duplex
                    Suite.
                </p>
            </div>

            {/* IMAGE COLLAGE (large left + 4 small right) */}
            <div className="w-full mt-20 mb-8  z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Large left image */}
                        <div className="md:col-span-1">
                            <div className=" overflow-hidden shadow-2xl">
                                <img
                                    src={images[0] ?? '/placeholder.svg'}
                                    alt="room large"
                                    className="w-full h-[420px] object-cover"
                                />
                            </div>
                        </div>

                        {/* Right small images */}
                        <div className="grid grid-cols-2 gap-6">
                            {images.slice(1, 5).map((img, index) => (
                                <div
                                    key={index}
                                    className="overflow-hidden shadow-lg"
                                >
                                    <img
                                        src={img ?? '/placeholder.svg'}
                                        alt={`thumb ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* DETAILS: At a glance / Amenities / Highlights */}
            <div className="container mx-auto px-6 pb-16">
                {/* At a glance */}
                <section className="max-w-5xl mx-auto mb-10">
                    <h3 className="text-2xl font-semibold mb-4">
                        Room Details
                    </h3>
                    <div className="border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm text-gray-600 mb-3">
                                At a glance
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                <div>
                                    <div className="font-medium">Size</div>
                                    <div className="mt-1">170 sqm</div>
                                </div>
                                <div>
                                    <div className="font-medium">Occupancy</div>
                                    <div className="mt-1">
                                        Up to {room.roomType?.maxOccupancy ?? 3}{' '}
                                        adults
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium">Beds</div>
                                    <div className="mt-1">
                                        King-size bed or twin
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium">View</div>
                                    <div className="mt-1">
                                        Dubai Skyline / Ocean View
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amenities quick list */}
                        <div>
                            <h4 className="text-sm text-gray-600 mb-3">
                                Amenities
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                                {quickAmenities.map((a) => (
                                    <li
                                        key={a}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="mt-1 text-amber-400">
                                            ✓
                                        </span>
                                        <span>{a}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Amenities (detailed) */}
                <section className="max-w-5xl mx-auto mb-10">
                    <h3 className="text-xl font-semibold mb-4">
                        Amenities (detailed)
                    </h3>
                    <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>
                                    Premium Drouault bedding with your choice of
                                    feather, goose down or anti-allergy filling
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>
                                    Curated pillow menu for personalised comfort
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>
                                    Spacious marble bathroom with rain shower
                                    and full-size bathtub
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>
                                    High-speed WiFi and in-room entertainment
                                </span>
                            </li>
                        </ul>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>Dyson Supersonic hair dryer</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>Private bar experience on request</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>
                                    Complimentary access to fitness center
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>24/7 butler and concierge service</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Highlights */}
                <section className="max-w-5xl mx-auto mb-6">
                    <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                    <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <ul className="space-y-2">
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>
                                    Floor-to-ceiling windows with panoramic
                                    views
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>
                                    Duplex suite with soundproof living and
                                    sleeping areas
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>
                                    Daily serenity sip and evening turndown
                                    service
                                </span>
                            </li>
                        </ul>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>
                                    Access to private beach and infinity pool
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>
                                    Complimentary access to kids club and family
                                    activities
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 mt-1">✓</span>
                                <span>
                                    Dedicated butler service upon request
                                </span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* REVIEWS - enhanced layout */}
                <section className="max-w-5xl mx-auto mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">Guest reviews</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-baseline gap-2">
                                <div className="text-2xl font-bold">
                                    {reviewStats.avg || '—'}
                                </div>
                                <div className="text-sm text-gray-500">/5</div>
                            </div>
                            <div className="text-sm text-gray-600">
                                {reviewStats.count} reviews
                            </div>
                        </div>
                    </div>

                    {reviewsLoading && (
                        <div className="text-sm text-gray-600">
                            Loading reviews…
                        </div>
                    )}
                    {reviewsError && (
                        <div className="text-sm text-red-600">
                            {reviewsError}
                        </div>
                    )}

                    {/* List */}
                    <div className="grid grid-cols-1 gap-6">
                        {reviews.map((r) => {
                            const author = 'Guest';
                            const rating = 0;
                            const avatar = null;
                            return (
                                <article key={r.reviewID}>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            {avatar ? (
                                                <img
                                                    src={avatar}
                                                    alt={author}
                                                    className="w-14 h-14 rounded-full object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                                                    {author
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">
                                                        {author}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(
                                                            r.reviewDate as any,
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div>{renderStars(rating)}</div>
                                            </div>

                                            <p className="mt-3 text-gray-700 leading-relaxed">
                                                {r.comment}
                                            </p>

                                            {r.images &&
                                                r.images.length > 0 && (
                                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                                        {r.images.map(
                                                            (src, i) => (
                                                                <img
                                                                    key={i}
                                                                    src={src}
                                                                    alt={`rev-${i}`}
                                                                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
