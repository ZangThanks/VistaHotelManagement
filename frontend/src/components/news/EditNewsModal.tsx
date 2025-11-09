/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';
import type { News } from '../../types/News';
import { axiosInstance } from '../../config/api';

interface EditNewsModalProps {
    open: boolean;
    onClose: () => void;
    news: News | null;
    onUpdated: () => void;
}

const EditNewsModal: React.FC<EditNewsModalProps> = ({
    open,
    onClose,
    news,
    onUpdated,
}) => {
    const [formData, setFormData] = useState<News | null>(null);
    const [loading, setLoading] = useState(false);

    // Khi mở modal -> nạp dữ liệu hiện tại
    useEffect(() => {
        if (news) setFormData({ ...news });
    }, [news]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value, type } = e.currentTarget;
        const checked = (e.currentTarget as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev!,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        setLoading(true);

        try {
            await axiosInstance.put(`/news/${formData.newsId}`, formData);
            alert('✅ Cập nhật tin tức thành công!');
            onUpdated();
            onClose();
        } catch (error) {
            console.error('Error updating news:', error);
            alert('❌ Có lỗi xảy ra khi cập nhật!');
        } finally {
            setLoading(false);
        }
    };

    if (!open || !formData) return null;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Nền mờ */}
                    <motion.div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sx z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal chính giữa */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <div
                            className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    ✏️ Chỉnh sửa tin tức
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-black"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tiêu đề
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded-lg"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phụ đề
                                    </label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nội dung
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full mt-1 p-2 border rounded-lg"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ảnh
                                    </label>
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded-lg"
                                        placeholder="/assets/images/example.jpg"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Ngày bắt đầu
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="startDate"
                                            value={
                                                formData.startDate?.slice(
                                                    0,
                                                    16,
                                                ) || ''
                                            }
                                            onChange={handleChange}
                                            className="w-full mt-1 p-2 border rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Ngày kết thúc
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="endDate"
                                            value={
                                                formData.endDate?.slice(
                                                    0,
                                                    16,
                                                ) || ''
                                            }
                                            onChange={handleChange}
                                            className="w-full mt-1 p-2 border rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="highlight"
                                        checked={formData.highlight}
                                        onChange={handleChange}
                                    />
                                    <label className="text-sm text-gray-700">
                                        Tin nổi bật
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition flex justify-center items-center gap-2"
                                >
                                    <FaSave />
                                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EditNewsModal;
