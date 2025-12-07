import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewsById } from '../../../services/newsService';
import { FaArrowLeft, FaCalendarAlt, FaClock } from 'react-icons/fa';
import type { NewsItem } from '../../../types/News';

export default function NewsDetail() {
    const { id } = useParams<{ id: string }>(); // Lấy newsId từ URL
    const navigate = useNavigate();

    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                if (!id) return;
                const data = await getNewsById(id);
                setNews(data as NewsItem);
            } catch (err) {
                setError('Không thể tải dữ liệu bài viết.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-600">
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-4">
                    {error || 'Bài viết không tồn tại.'}
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    <FaArrowLeft className="inline mr-2" /> Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-black mb-6 transition"
            >
                <FaArrowLeft className="mr-2" /> Quay lại
            </button>

            <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-96 object-cover rounded-xl shadow-md mb-8"
            />

            <h1 className="text-4xl font-playfair font-semibold mb-3 text-gray-900">
                {news.title}
            </h1>
            <p className="text-lg text-gray-500 mb-6">{news.subtitle}</p>

            <div className="flex items-center gap-6 mb-6 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                    <FaCalendarAlt />{' '}
                    <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FaClock />{' '}
                    <span>
                        {new Date(news.startDate).toLocaleDateString()} →{' '}
                        {new Date(news.endDate).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {news.content}
            </div>

            {news.highlight && (
                <div className="mt-10 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                    <p className="font-semibold text-yellow-700">
                        🌟 Đây là tin nổi bật trong tuần!
                    </p>
                </div>
            )}
        </div>
    );
}
