/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaPlus,
    FaSearch,
    FaTag,
    FaCalendarAlt,
    FaEye,
    FaEyeSlash,
    FaAngleLeft,
    FaAngleRight,
} from 'react-icons/fa';
import PageHeader from '../../../components/info_management/PageHeader';
import StatCard from '../../../components/info_management/StatCard';
import InfoCard from '../../../components/info_management/InfoCard';
import { Dialog } from '../../../components/info_management/Dialog';
import AddInfoForm from '../../../components/info_management/AddInfoForm';
import { getAll } from '../../../services/newsService';
import type { NewsItem } from '../../../types/News';
import EditNewsModal from '../../../components/news/EditNewsModal';
const InfoManagement: React.FC = () => {
    const navigate = useNavigate();
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [filteredList, setFilteredList] = useState<NewsItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('lastUpdated');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEditItem = (item: NewsItem) => {
        setSelectedNews(item);
        setIsEditModalOpen(true);
    };

    // Gọi API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAll();
                setNewsList(data);
                setFilteredList(data);
            } catch (error) {
                console.error('Error loading news:', error);
            }
        };
        fetchData();
    }, []);

    // Lọc & sắp xếp
    useEffect(() => {
        let filtered = [...newsList];

        if (searchTerm) {
            filtered = filtered.filter(
                (n) =>
                    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    n.subtitle.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter((n) =>
                n.title.toLowerCase().includes(selectedCategory.toLowerCase()),
            );
        }

        switch (sortBy) {
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'oldest':
                filtered.sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                );
                break;
            default:
                filtered.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                );
        }

        setFilteredList(filtered);
    }, [searchTerm, selectedCategory, sortBy, newsList]);

    function fetchNewsData(): void {
        getAll()
            .then((data: NewsItem[]) => {
                setNewsList(data);
                setFilteredList(data);
            })
            .catch((error) => {
                console.error('Error loading news:', error);
            });
    }

    return (
        <div className="p-6 space-y-8">
            <PageHeader
                title="News Management"
                buttonText="Add New News"
                buttonIcon={<FaPlus />}
                onButtonClick={() => setIsAddModalOpen(true)}
            />
            {/* Cards thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<FaTag className="text-gold" />}
                    iconBgColor="bg-gold/10"
                    value={newsList.length.toString()}
                    label="Total News"
                />
                <StatCard
                    icon={<FaEye className="text-blue-500" />}
                    iconBgColor="bg-blue-500/10"
                    value={
                        newsList
                            .filter((n) => n.highlight === true)
                            .length.toString() ?? '0'
                    }
                    label="Highlighted"
                />
                <StatCard
                    icon={<FaCalendarAlt className="text-green-600" />}
                    iconBgColor="bg-green-600/10"
                    value="N/A"
                    label="Upcoming Events"
                />
                <StatCard
                    icon={<FaEyeSlash className="text-pink-500" />}
                    iconBgColor="bg-pink-500/10"
                    value="N/A"
                    label="Archived"
                />
            </div>
            {/* Filter */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search news..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-44">
                            <label className="block text-sm text-gray-500 mb-1">
                                Sort By:
                            </label>
                            <select
                                className="w-full p-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="lastUpdated">
                                    Last Updated
                                </option>
                                <option value="title">Title (A-Z)</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            {/* Danh sách */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredList.map((item) => (
                    <InfoCard
                        key={item.newsId}
                        item={{
                            id: item.newsId,
                            title: item.title,
                            category: 'News',
                            status: item.highlight ? 'published' : 'draft',
                            preview: item.subtitle,
                            image: item.imageUrl,
                            updatedDate: new Date(
                                item.createdAt,
                            ).toLocaleDateString(),
                            views: 0,
                        }}
                        onDelete={() => console.log('delete', item.newsId)}
                        onEdit={() => handleEditItem(item)}
                        onView={() => navigate(`/admin/info/${item.newsId}`)}
                    />
                ))}
            </div>
            {filteredList.length === 0 && (
                <div className="text-center py-12 bg-light/50 rounded-lg">
                    <h3 className="text-xl font-playfair mb-2">
                        No news found
                    </h3>
                    <p className="text-gray-500">Try adjusting your search</p>
                </div>
            )}
            {/* Add modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <AddInfoForm onClose={() => setIsAddModalOpen(false)} />
            </Dialog>

            <EditNewsModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                news={selectedNews}
                onUpdated={fetchNewsData} // callback reload lại danh sách
            />
        </div>
    );
};

export default InfoManagement;
