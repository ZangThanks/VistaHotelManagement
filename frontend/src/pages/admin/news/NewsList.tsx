/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaPlus,
    FaSearch,
    FaTag,
    FaCalendarAlt,
    FaEye,
    FaEyeSlash,
} from 'react-icons/fa';

import { getAll } from '../../../services/newsService';
import type { NewsItem } from '../../../types/News';
import EditNewsModal from '../../../components/news/EditNewsModal';
import PageHeader from '../../../components/news/PageHeader';
import StatCard from '../../../components/news/StatCard';
import InfoCard from '../../../components/news/NewsCard';
import AddInfoForm from '../../../components/news/AddNewsModal';
import { Dialog } from '../../../components/news/Dialog';
import { useToastContext } from '../../../hooks/useToastContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '../../../components/common/Select';

const NewsList: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToastContext();

    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [filteredList, setFilteredList] = useState<NewsItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('lastUpdated');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleEditItem = (item: NewsItem) => {
        setSelectedNews(item);
        setIsEditModalOpen(true);
    };

    // Load API
    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getAll();
            setNewsList(data);
            setFilteredList(data);
        } catch (error) {
            toast.error('Không thể tải danh sách tin tức');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Hàm sort theo loại tin
    const getSortableDate = (n: NewsItem) => {
        if (n.type === 'NEWS') return new Date(n.createdAt).getTime();
        if (n.startDate) return new Date(n.startDate).getTime();
        return 0;
    };

    // Lọc & sắp xếp
    useEffect(() => {
        let filtered = [...newsList];

        // Search
        if (searchTerm) {
            filtered = filtered.filter(
                (n) =>
                    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    n.subtitle.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((n) => n.type === selectedCategory);
        }

        // Sort
        switch (sortBy) {
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;

            case 'oldest':
                filtered.sort(
                    (a, b) => getSortableDate(a) - getSortableDate(b),
                );
                break;

            default:
                filtered.sort(
                    (a, b) => getSortableDate(b) - getSortableDate(a),
                );
        }

        setFilteredList(filtered);
    }, [searchTerm, selectedCategory, sortBy, newsList]);

    // Đếm sự kiện sắp diễn ra
    const upcomingEvents = newsList.filter(
        (n) =>
            (n.type === 'EVENT' || n.type === 'PROMOTION') &&
            n.startDate &&
            new Date(n.startDate) > new Date(),
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6"
        >
            <div className="max-w-[1600px] mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <PageHeader
                        title="News Management"
                        buttonText="Add New"
                        buttonIcon={<FaPlus />}
                        onButtonClick={() => setIsAddModalOpen(true)}
                    />
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <motion.div
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="cursor-pointer"
                    >
                        <StatCard
                            icon={<FaTag className="text-gold" />}
                            iconBgColor="bg-gold/10"
                            value={newsList.length.toString()}
                            label="Total Items"
                        />
                    </motion.div>
                    <motion.div
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="cursor-pointer"
                    >
                        <StatCard
                            icon={<FaEye className="text-blue-500" />}
                            iconBgColor="bg-blue-500/10"
                            value={newsList
                                .filter((n) => n.highlight)
                                .length.toString()}
                            label="Highlighted"
                        />
                    </motion.div>
                    <motion.div
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="cursor-pointer"
                    >
                        <StatCard
                            icon={<FaCalendarAlt className="text-green-600" />}
                            iconBgColor="bg-green-600/10"
                            value={upcomingEvents.length.toString()}
                            label="Upcoming Events"
                        />
                    </motion.div>
                    <motion.div
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="cursor-pointer"
                    >
                        <StatCard
                            icon={<FaEyeSlash className="text-pink-500" />}
                            iconBgColor="bg-pink-500/10"
                            value="0"
                            label="Archived"
                        />
                    </motion.div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white p-6 rounded-xl shadow-sm"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none transition"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="w-full md:w-44">
                            <label className="block text-sm text-gray-500 mb-1">
                                Category:
                            </label>
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger />

                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="NEWS">News</SelectItem>
                                    <SelectItem value="EVENT">
                                        Events
                                    </SelectItem>
                                    <SelectItem value="PROMOTION">
                                        Promotions
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort */}
                        <div className="w-full md:w-44">
                            <label className="block text-sm text-gray-500 mb-1">
                                Sort By:
                            </label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger />
                                <SelectContent>
                                    <SelectItem value="lastUpdated">
                                        Last Updated
                                    </SelectItem>
                                    <SelectItem value="title">
                                        Title (A-Z)
                                    </SelectItem>
                                    <SelectItem value="oldest">
                                        Oldest First
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </motion.div>

                {/* List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {loading ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                    className="w-12 h-12 border-4 border-gray-200 border-t-[#b9ad96] rounded-full"
                                />
                                <p className="text-gray-600 font-medium">
                                    Loading news...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredList.map((item, index) => (
                                <motion.div
                                    key={item.newsId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.1 * index,
                                        duration: 0.3,
                                        type: 'spring',
                                        stiffness: 300,
                                    }}
                                    className="cursor-pointer"
                                >
                                    <InfoCard
                                        item={{
                                            id: item.newsId,
                                            title: item.title,
                                            category: item.type,
                                            status: item.highlight
                                                ? 'published'
                                                : 'draft',
                                            preview: item.subtitle,
                                            image: item.imageUrl,
                                            updatedDate: new Date(
                                                item.createdAt,
                                            ).toLocaleDateString(),
                                            views: 0,
                                        }}
                                        onDelete={() =>
                                            console.log('delete', item.newsId)
                                        }
                                        onEdit={() => handleEditItem(item)}
                                        onView={() =>
                                            navigate(
                                                `/admin/info/${item.newsId}`,
                                            )
                                        }
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {filteredList.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="text-center py-12 bg-light/50 rounded-lg"
                    >
                        <h3 className="text-xl font-playfair mb-2">
                            No items found
                        </h3>
                        <p className="text-gray-500">
                            Try adjusting your search
                        </p>
                    </motion.div>
                )}

                {/* Add Modal */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <AddInfoForm
                        open={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        onSuccess={() => {
                            toast.success('Created successfully!');
                            fetchData();
                        }}
                        onError={(msg) => toast.error(msg)}
                    />
                </Dialog>

                {/* Edit Modal */}
                <EditNewsModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    news={selectedNews}
                    onUpdated={() => {
                        toast.success('Updated successfully!');
                        fetchData();
                    }}
                    onError={(msg) => toast.error(msg)}
                />
            </div>
        </motion.div>
    );
};

export default NewsList;
