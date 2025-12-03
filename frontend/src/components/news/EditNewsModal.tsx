import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaCloudUploadAlt } from 'react-icons/fa';
import TinyMCE from './TinyMCE';

import { uploadImageToCloudinary } from '../../services/cloudinaryService';
import { axiosInstance } from '../../config/api';

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '../common/Select';

import type { News } from '../../types/News';

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
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (news) {
            setFormData({ ...news });
            setPreviewImage(news.imageUrl || null);
        }
    }, [news]);

    if (!open || !formData) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev!,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleContentChange = (value: string) => {
        setFormData((prev) => ({ ...prev!, content: value }));
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];

        setPreviewImage(URL.createObjectURL(file));

        const uploaded = await uploadImageToCloudinary(file);
        setFormData((prev) => ({ ...prev!, imageUrl: uploaded.secure_url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axiosInstance.put(
                `/news/update/${formData.newsId}`,
                formData,
            );

            alert('Cập nhật tin tức thành công!');
            onUpdated();
            onClose();
        } catch (error) {
            console.error('Update error:', error);
            alert('Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Background overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh] border border-[#F5F0EB]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">
                                    Edit News
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-600 hover:text-black"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            {/* FORM */}
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* BASIC INFO */}
                                <div className="space-y-4 pb-6 border-b border-[#F5F0EB]">
                                    <h3 className="text-xl font-semibold">
                                        Basic Information
                                    </h3>

                                    {/* Title */}
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-[#F5F0EB] rounded-2xl bg-white focus:border-black"
                                            required
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold">
                                            Category *
                                        </label>

                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev!,
                                                    category: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                Select Category
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="about">
                                                    About Us
                                                </SelectItem>
                                                <SelectItem value="services">
                                                    Services
                                                </SelectItem>
                                                <SelectItem value="events">
                                                    Events
                                                </SelectItem>
                                                <SelectItem value="promotion">
                                                    Promotion
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold">
                                            Status
                                        </label>

                                        <Select
                                            value={
                                                formData.highlight
                                                    ? 'published'
                                                    : 'draft'
                                            }
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev!,
                                                    highlight:
                                                        value === 'published',
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                Select Status
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="published">
                                                    Published
                                                </SelectItem>
                                                <SelectItem value="draft">
                                                    Draft
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Dates */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-2 text-sm font-semibold">
                                                Start Date
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
                                                className="w-full px-4 py-3 border-2 border-[#F5F0EB] rounded-2xl bg-white focus:border-black"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm font-semibold">
                                                End Date
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
                                                className="w-full px-4 py-3 border-2 border-[#F5F0EB] rounded-2xl bg-white focus:border-black"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="space-y-4 pb-6 border-b border-[#F5F0EB]">
                                    <h3 className="text-xl font-semibold">
                                        Content
                                    </h3>

                                    <div>
                                        <label className="block mb-2 text-sm font-semibold">
                                            Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            name="subtitle"
                                            value={formData.subtitle}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-[#F5F0EB] rounded-2xl bg-white focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-semibold">
                                            Full Content *
                                        </label>
                                        <TinyMCE
                                            initialValue={formData.content}
                                            onChange={handleContentChange}
                                        />
                                    </div>
                                </div>

                                {/* IMAGE UPLOAD */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">
                                        Featured Image
                                    </h3>

                                    <div
                                        className="border-2 border-dashed border-[#F5F0EB] p-8 rounded-2xl text-center cursor-pointer hover:border-black hover:bg-[#F5F0EB]"
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    'editFeatureImg',
                                                )
                                                ?.click()
                                        }
                                    >
                                        <FaCloudUploadAlt className="text-4xl mx-auto mb-3" />
                                        <p className="font-semibold">
                                            Click to upload
                                        </p>
                                        <input
                                            id="editFeatureImg"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </div>

                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            className="w-full h-48 object-cover rounded-2xl shadow"
                                        />
                                    )}
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-3 border border-black rounded-2xl hover:bg-black hover:text-white"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3 bg-black text-white rounded-2xl hover:bg-gray-900"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                        <FaSave className="inline ml-2" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EditNewsModal;
