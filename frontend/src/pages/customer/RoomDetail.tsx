/*eslint-disable */
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Room } from '../../types/Room';
import RoomCard from '../../components/RoomCard';
import Calendar from '../../components/common/Calendar';
import Header from '../../components/Header';

function formatCurrency(v: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(v);
}

export default function RoomDetail() {
    const { id } = useParams<{ id: string }>();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // carousel
    const [index, setIndex] = useState(0);

    // booking dates (Date | null)
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    // const [checkOut, setCheckOut] = useState<Date | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        // try mock endpoint first, fallback to local mock
        fetch(`/room/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('no remote');
                return res.json();
            })
            .then((data: any) => {
                if (!mounted) return;
                setRoom(data);
            })
            .catch(() => {
                // fallback mock data
                const mock: Room = {
                    roomNumber: id || '101',
                    roomType: {
                        typeName: 'One Bedroom Suite',
                        basePrice: 15000000,
                        description:
                            'A luxurious one-bedroom suite with private living area, panoramic views and bespoke amenities.',
                        maxOccupancy: 3,
                        // additional fields optional
                    } as any,
                    images: [
                        '/images/mock-suite-1.jpg',
                        '/images/mock-suite-2.jpg',
                        '/images/mock-suite-3.jpg',
                        '/images/mock-suite-4.jpg',
                    ],
                    notes: 'This suite includes complimentary breakfast, access to the private beach and chauffeur service.',
                    availableFrom: new Date().toISOString(),
                    availableTo: new Date(
                        new Date().setMonth(new Date().getMonth() + 6),
                    ).toISOString(),
                    // other optional fields
                };
                if (mounted) setRoom(mock);
            })
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [id]);

    const images = useMemo(
        () => (room?.images && (room.images as string[])) || [],
        [room],
    );

    useEffect(() => {
        // loop carousel every 6s
        const t = setInterval(() => {
            setIndex((i) => (images.length ? (i + 1) % images.length : 0));
        }, 6000);
        return () => clearInterval(t);
    }, [images.length]);

    if (loading) return <div className="p-8 text-center">Loading room…</div>;
    if (error)
        return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!room) return <div className="p-8 text-center">Room not found.</div>;

    const price = room.roomType?.basePrice ?? 0;
    const title = room.roomType?.typeName ?? `Room ${room.roomNumber}`;
    const description = room.roomType?.description ?? room.notes ?? '';

    // mock amenities if none
    const amenities: string[] = (room.roomType as any)?.amenities ?? [
        'King bed',
        'Private living room',
        'Panoramic windows',
        'Ensuite bathroom with bathtub',
        'In-room safe',
        'Complimentary Wi-Fi',
        'Mini bar',
        'Air conditioning',
    ];

    const handleThumbnailClick = (i: number) => {
        setIndex(i);
    };

    const handleBook = () => {
        // simple booking action (mock)
        // alert(
        //     `Booking requested for ${title}\nDates: ${
        //         checkIn?.toLocaleDateString() ?? '-'
        //     // } → ${
        //     //     // checkOut?.toLocaleDateString() ?? '-'
        //     // }\nPrice per night: ${formatCurrency(price)}`,
        // );
    };

    return (
        <div>
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
                <Header />
            </div>

            <div
                className="bg-white min-h-screen"
                style={{ fontFamily: 'var(--font-sans)' }}
            >
                <div className="container mx-auto px-6 py-10">
                    {/* back + breadcrumb */}
                    <div className="mb-6">
                        <Link
                            to="/rooms"
                            className="text-sm text-gray-600 hover:underline"
                        >
                            ← Back to Rooms
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left / main content */}
                        <main className="lg:col-span-2">
                            {/* Hero carousel */}
                            <div className="rounded-xl overflow-hidden shadow-lg">
                                <div className="relative h-[420px] bg-gray-100">
                                    {images.length ? (
                                        <img
                                            src={images[index]}
                                            alt={`${title} image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No image
                                        </div>
                                    )}

                                    {/* thumbnails overlay bottom */}
                                    <div className="absolute left-0 right-0 bottom-4 px-4">
                                        <div className="flex gap-2 justify-center">
                                            {images
                                                .slice(0, 6)
                                                .map((src, i) => (
                                                    <button
                                                        key={src + i}
                                                        onClick={() =>
                                                            handleThumbnailClick(
                                                                i,
                                                            )
                                                        }
                                                        className={`w-20 h-12 overflow-hidden rounded-md border-2 ${
                                                            index === i
                                                                ? 'border-amber-400'
                                                                : 'border-transparent'
                                                        }`}
                                                    >
                                                        <img
                                                            src={src}
                                                            alt={`thumb ${
                                                                i + 1
                                                            }`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Title + quick info */}
                            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-semibold">
                                        {title}
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-2 max-w-2xl">
                                        {description}
                                    </p>
                                    <div className="mt-3 flex gap-3 text-sm text-gray-700">
                                        <div>
                                            {room.roomType?.maxOccupancy ?? 2}{' '}
                                            guests
                                        </div>
                                        <div>·</div>
                                        <div>
                                            {room.roomNumber
                                                ? `No. ${room.roomNumber}`
                                                : ''}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">
                                            From
                                        </div>
                                        <div className="text-xl font-semibold">
                                            {formatCurrency(price)}{' '}
                                            <span className="text-sm font-normal text-gray-500">
                                                / night
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* amenities + details */}
                            <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">
                                        What's included
                                    </h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                                        {amenities.map((a) => (
                                            <li
                                                key={a}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="w-2 h-2 bg-amber-400 rounded-full inline-block" />
                                                <span>{a}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">
                                        Suite details
                                    </h3>
                                    <dl className="text-sm text-gray-700 space-y-2">
                                        <div>
                                            <dt className="font-medium">
                                                Occupancy
                                            </dt>
                                            <dd>
                                                {room.roomType?.maxOccupancy ??
                                                    '—'}{' '}
                                                persons
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium">
                                                Price
                                            </dt>
                                            <dd>
                                                {formatCurrency(price)} / night
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium">
                                                Availability
                                            </dt>
                                            <dd>
                                                {room.availableFrom
                                                    ? new Date().toLocaleDateString()
                                                    : // room.availableFrom,
                                                      '—'}{' '}
                                                —{' '}
                                                {room.availableTo
                                                    ? new Date().toLocaleDateString()
                                                    : // room.availableTo,
                                                      '—'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </section>

                            {/* description / long content */}
                            <section className="mt-8">
                                <h3 className="text-lg font-semibold mb-3">
                                    About this suite
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {room.roomType?.description ?? room.notes}
                                </p>
                            </section>

                            {/* Similar / You may also like */}
                            <section className="mt-10">
                                <h3 className="text-lg font-semibold mb-4">
                                    You may also like
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Simple use of RoomCard with mock placeholders */}
                                    <RoomCard
                                        room={
                                            {
                                                roomNumber: '201',
                                                roomType: {
                                                    typeName:
                                                        'Two Bedroom Suite',
                                                    basePrice: 25000000,
                                                    description:
                                                        'Spacious two-bedroom suite.',
                                                } as any,
                                                images: [
                                                    '/images/mock-suite-2.jpg',
                                                ],
                                            } as any
                                        }
                                    />
                                    <RoomCard
                                        room={
                                            {
                                                roomNumber: '102',
                                                roomType: {
                                                    typeName: 'Deluxe Suite',
                                                    basePrice: 12000000,
                                                    description:
                                                        'Comfortable deluxe.',
                                                } as any,
                                                images: [
                                                    '/images/mock-suite-3.jpg',
                                                ],
                                            } as any
                                        }
                                    />
                                </div>
                            </section>
                        </main>

                        {/* Right / booking sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 bg-white border rounded-xl p-5 shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            Price
                                        </div>
                                        <div className="text-lg font-bold">
                                            {formatCurrency(price)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            per night
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="text-sm text-gray-600">
                                        Check-in & Check-out
                                    </label>
                                    <div className="mt-2">
                                        <Calendar
                                            selectedDate={checkIn}
                                            onDateSelect={(d) => setCheckIn(d)}
                                            // minDate={
                                            //     // new Date(
                                            //     //     room.availableFrom ?? undefined,
                                            //     // )
                                            // }
                                            // maxDate={
                                            //     room.availableTo
                                            //         ? new Date(room.availableTo)
                                            //         : undefined
                                            // }
                                        />
                                    </div>
                                    <div className="mt-3 text-xs text-gray-600">
                                        Selected:{' '}
                                        {checkIn
                                            ? checkIn.toLocaleDateString()
                                            : '-'}{' '}
                                        —{' '}
                                        {/* {checkOut
                                        ? checkOut.toLocaleDateString()
                                        : '-'} */}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        onClick={handleBook}
                                        className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-md py-3 font-semibold transition"
                                    >
                                        Book now
                                    </button>
                                </div>

                                <div className="mt-4 text-xs text-gray-500">
                                    Free cancellation up to 48 hours before
                                    check-in. Rates and availability subject to
                                    change.
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}
