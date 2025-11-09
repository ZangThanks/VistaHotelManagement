import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import {
//     Card,
//     CardFooter,
// } from './components_bonus/my-card/components/ui/card';
import type { Room } from '../types/Room';

interface RoomCardProps {
    room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
    const images =
        (room.roomType?.images as string[] | undefined) || room.images || [];
    const title = room.roomType?.name || room.roomNumber || 'Room';
    const description = room.roomType?.description || room.notes || '';
    const price = room.roomType?.basePrice ?? 0;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        if (images.length === 0) return;
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        if (images.length === 0) return;
        setCurrentImageIndex(
            (prev) => (prev - 1 + images.length) % images.length,
        );
    };

    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);

    const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

    return (
        <Link to={`/rooms/${room.id}`}>
            <Card className="w-full max-w-md items-center mx-auto overflow-hidden border-0 rounded-xl hover:shadow-lg transition-shadow duration-300 ease-in-out mb-5">
                <div className="relative">
                    <div className="relative h-[300px] w-[400px]">
                        {images.length > 0 ? (
                            isVideo(images[currentImageIndex]) ? (
                                <video
                                    src={images[currentImageIndex]}
                                    autoPlay
                                    muted
                                    loop
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={
                                        images[currentImageIndex] ||
                                        '/placeholder.svg'
                                    }
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            )
                        ) : (
                            <img
                                src="/placeholder.svg"
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        )}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-700 bg-white/70 rounded-full"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-700 bg-white/70 rounded-full"
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <CardFooter className="flex flex-col items-center pt-4 pb-6">
                    <h3 className="text-lg font-semibold text-center">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 text-center px-4">
                        {description}
                    </p>
                    <p className="text-sm text-gray-800 mt-2 font-medium">
                        {formattedPrice} / night
                    </p>
                </CardFooter>
            </Card>
        </Link>
    );
}
