import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMagnifyingGlass,
    faXmark,
    faArrowRight,
    faBed,
    faConciergeBell,
} from '@fortawesome/free-solid-svg-icons';
import type { SearchSidebarProps } from '../types/Header';
import type { Room } from '../types/Room';
import type { RoomType } from '../types/RoomType';
import type { Service } from '../types/Service';
import { getAllRooms } from '../services/roomService';
import { getAllRoomTypes } from '../services/roomTypeService';
import { getAll as getAllServices } from '../services/serviceService';

interface SearchResult {
    id: string;
    name: string;
    category: string;
    type: 'room' | 'roomType' | 'service';
    image?: string;
    price?: number;
    description?: string;
    roomNumber?: string;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [services, setServices] = useState<Service[]>([]);

    const setInitialSuggestions = useCallback(
        (roomTypesData: RoomType[], servicesData: Service[]) => {
            const suggestions: SearchResult[] = [];

            // Add featured room types
            roomTypesData.slice(0, 3).forEach((roomType) => {
                if (roomType.roomTypeID && roomType.typeName) {
                    suggestions.push({
                        id: roomType.roomTypeID,
                        name: roomType.typeName,
                        category: 'Loại phòng',
                        type: 'roomType',
                        price: roomType.basePrice,
                        description: roomType.description,
                    });
                }
            });

            // Add featured services
            servicesData.slice(0, 2).forEach((service) => {
                suggestions.push({
                    id: service.serviceID,
                    name: service.serviceName,
                    category:
                        service.serviceCategory === 'FOOD_BEVERAGE'
                            ? 'Ăn uống'
                            : 'Dịch vụ',
                    type: 'service',
                    price: service.price,
                    description: service.description,
                });
            });

            setSearchResults(suggestions);
        },
        [],
    );

    const loadInitialData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [roomsData, roomTypesData, servicesData] = await Promise.all([
                getAllRooms().catch(() => []),
                getAllRoomTypes().catch(() => []),
                getAllServices().catch(() => []),
            ]);

            setRooms(roomsData || []);
            setRoomTypes(roomTypesData || []);
            setServices(servicesData || []);

            // Set initial suggestions
            if (!searchQuery) {
                setInitialSuggestions(roomTypesData || [], servicesData || []);
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, setInitialSuggestions]);

    // Load initial data when sidebar opens
    useEffect(() => {
        if (isOpen) {
            loadInitialData();
        }
    }, [isOpen, loadInitialData]);

    // Search function
    const performSearch = useCallback(
        (query: string) => {
            if (!query.trim()) {
                setInitialSuggestions(roomTypes, services);
                return;
            }

            setIsLoading(true);
            const results: SearchResult[] = [];

            try {
                const searchLower = query.toLowerCase();

                // Search rooms by room number
                rooms.forEach((room) => {
                    if (room.roomNumber?.toLowerCase().includes(searchLower)) {
                        results.push({
                            id: room.roomNumber || '',
                            name: `Phòng ${room.roomNumber}`,
                            category: 'Số phòng',
                            type: 'room',
                            roomNumber: room.roomNumber,
                            image:
                                room.images?.[0] ||
                                '/src/assets/images/resort-bg.png',
                            description: room.roomType?.typeName,
                        });
                    }
                });

                // Search room types
                roomTypes.forEach((roomType) => {
                    if (
                        roomType.typeName
                            ?.toLowerCase()
                            .includes(searchLower) ||
                        roomType.description
                            ?.toLowerCase()
                            .includes(searchLower)
                    ) {
                        if (roomType.roomTypeID && roomType.typeName) {
                            results.push({
                                id: roomType.roomTypeID,
                                name: roomType.typeName,
                                category: 'Loại phòng',
                                type: 'roomType',
                                price: roomType.basePrice,
                                description: roomType.description,
                            });
                        }
                    }
                });

                // Search services
                services.forEach((service) => {
                    if (
                        service.serviceName
                            .toLowerCase()
                            .includes(searchLower) ||
                        service.description.toLowerCase().includes(searchLower)
                    ) {
                        results.push({
                            id: service.serviceID,
                            name: service.serviceName,
                            category:
                                service.serviceCategory === 'FOOD_BEVERAGE'
                                    ? 'Ăn uống'
                                    : 'Dịch vụ',
                            type: 'service',
                            price: service.price,
                            description: service.description,
                        });
                    }
                });

                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        },
        [rooms, roomTypes, services, setInitialSuggestions],
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            performSearch(searchQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, performSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleResultClick = (result: SearchResult) => {
        // Handle navigation based on result type
        switch (result.type) {
            case 'room':
                // Navigate to room detail page using room number
                if (result.roomNumber) {
                    navigate(`/room/${result.roomNumber}`);
                }
                break;
            case 'roomType':
                // Navigate to room list filtered by room type
                navigate(`/room?type=${result.id}`);
                break;
            case 'service':
                // Navigate to service page or service detail
                navigate(`/service?id=${result.id}`);
                break;
            default:
                console.log('Unknown result type:', result);
        }
        onClose();
    };

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'room':
            case 'roomType':
                return faBed;
            case 'service':
                return faConciergeBell;
            default:
                return faMagnifyingGlass;
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black z-40"
                />
            )}

            {/* Sidebar Search (Slide LEFT → RIGHT) */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: isOpen ? 0 : '-100%' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-xl z-50 border-r"
            >
                {/* Header */}
                <div className="px-4 py-4 flex items-center justify-between border-b">
                    <button
                        onClick={onClose}
                        className="text-lg hover:text-gray-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>

                    <span className="font-serif text-gray-700">Search</span>

                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="text-gray-600 text-lg"
                    />
                </div>

                {/* Input Search */}
                <div className="px-4 py-4 border-b">
                    <div className="relative flex items-center">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute left-3 text-gray-500"
                        />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search for rooms, services..."
                            className="w-full px-10 py-2 border-b focus:outline-none font-serif text-sm focus:border-blue-500 transition-colors"
                        />

                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results */}
                <div className="px-4 py-4 flex-1 overflow-y-auto">
                    <h3 className="text-gray-700 mb-3 font-serif">
                        {searchQuery
                            ? `Results (${searchResults.length})`
                            : 'Suggestions'}
                    </h3>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="space-y-3">
                            {searchResults.map((result) => (
                                <div
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleResultClick(result)}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-200 border border-gray-100 hover:shadow-sm"
                                >
                                    {/* Image or Icon */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {result.image &&
                                        result.type === 'room' ? (
                                            <img
                                                src={result.image}
                                                alt={result.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target =
                                                        e.target as HTMLImageElement;
                                                    target.src =
                                                        '/src/assets/images/resort-bg.png';
                                                    target.onerror = null; // Prevent infinite loop
                                                }}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={getResultIcon(
                                                    result.type,
                                                )}
                                                className="text-gray-400 text-lg"
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-serif text-gray-900 font-medium text-sm truncate">
                                                    {result.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {result.category}
                                                    {result.type === 'room' && (
                                                        <span className="ml-2 text-blue-500">
                                                            • Chi tiết phòng
                                                        </span>
                                                    )}
                                                    {result.type ===
                                                        'roomType' && (
                                                        <span className="ml-2 text-green-500">
                                                            • Xem danh sách
                                                            phòng
                                                        </span>
                                                    )}
                                                    {result.type ===
                                                        'service' && (
                                                        <span className="ml-2 text-purple-500">
                                                            • Xem dịch vụ
                                                        </span>
                                                    )}
                                                </p>
                                                {result.description && (
                                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                        {result.description}
                                                    </p>
                                                )}
                                            </div>

                                            {result.price && (
                                                <div className="text-right ml-2">
                                                    <p className="text-xs text-blue-600 font-medium">
                                                        {result.price.toLocaleString()}{' '}
                                                        VNĐ
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex-shrink-0">
                                        <FontAwesomeIcon
                                            icon={faArrowRight}
                                            className="text-gray-300 text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="text-2xl mb-2"
                            />
                            <p className="text-sm font-serif">
                                {searchQuery
                                    ? 'Không tìm thấy kết quả nào'
                                    : 'Bắt đầu tìm kiếm...'}
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default SearchSidebar;
