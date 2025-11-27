import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { DialogContent, DialogHeader, DialogTitle } from './Dialog';
import TinyMCE from './TinyMCE';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '../common/Select';

import { uploadImageToCloudinary } from '../../services/cloudinaryService';
import { createNews } from '../../services/newsService';

interface AddInfoFormProps {
    onClose: () => void;
}

const AddNewsForm: React.FC<AddInfoFormProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        status: 'published',
        shortDescription: '',
        content: '',
        featuredImage: null as File | null,
        startDate: '',
        endDate: '',
    });

    const [charCount, setCharCount] = useState({ shortDescription: 0 });
    const [featuredImagePreview, setFeaturedImagePreview] = useState<
        string | null
    >(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Handle input
    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'shortDescription') {
            setCharCount({ shortDescription: value.length });
        }
    };

    const handleContentChange = (content: string) => {
        setFormData((prev) => ({ ...prev, content }));
    };

    // Upload image
    const handleFeaturedImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, featuredImage: file }));

            const reader = new FileReader();
            reader.onload = () =>
                setFeaturedImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let featuredImageUrl = '';
            if (formData.featuredImage) {
                const uploaded = await uploadImageToCloudinary(
                    formData.featuredImage,
                );
                featuredImageUrl = uploaded.secure_url;
            }

            const payload = {
                title: formData.title,
                subtitle: formData.shortDescription,
                content: formData.content,
                imageUrl: featuredImageUrl,
                startDate: formData.startDate,
                endDate: formData.endDate,
                createdAt: new Date().toISOString(),
                highlight: formData.status === 'published',
                category: formData.category,
            };

            await createNews(payload);
            setSuccess(true);
            setTimeout(() => onClose(), 1500);
        } catch (error) {
            console.error('Create news failed:', error);
            alert('Error creating news!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {/* Wrapping Content With Motion */}
            <motion.div
                key="add-news-modal"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
            >
                <DialogContent className="max-w-5xl">
                    {/* Inner content animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="max-h-[85vh] overflow-y-auto pr-4"
                    >
                        <DialogHeader>
                            <DialogTitle>NEWS</DialogTitle>
                        </DialogHeader>

                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 bg-emerald-50 text-emerald-700 rounded-2xl text-center border-2 border-emerald-200 mt-6"
                            >
                                <h3 className="text-2xl font-bold mb-2">
                                    News Added Successfully!
                                </h3>
                            </motion.div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-8 mt-6"
                            >
                                {/* BASIC INFO */}
                                <div className="space-y-6 pb-8 mb-4 border-b-2 border-[#F5F0EB]">
                                    <h3 className="text-xl font-bold text-black">
                                        Basic Information
                                    </h3>

                                    {/* TITLE */}
                                    <div>
                                        <label className="block mb-2 font-semibold text-black">
                                            Title{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-[#F5F0EB] rounded-2xl focus:border-black transition-all hover:shadow-xl bg-white"
                                            placeholder="Enter news title"
                                        />
                                    </div>

                                    {/* CATEGORY */}
                                    <div>
                                        <label className="block mb-2 font-semibold text-black">
                                            Category{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    category: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger />
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

                                    {/* STATUS */}
                                    <div>
                                        <label className="block mb-2 font-semibold text-black">
                                            Status
                                        </label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    status: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger />
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

                                    {/* DATE RANGE */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-2 font-semibold text-black">
                                                Start Date *
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="startDate"
                                                required
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border-2 border-[#F5F0EB] rounded-2xl focus:border-black transition-all hover:shadow-xl bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-semibold text-black">
                                                End Date *
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="endDate"
                                                required
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border-2 border-[#F5F0EB] rounded-2xl focus:border-black transition-all hover:shadow-xl bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="space-y-6 pb-8 border-b-2 border-[#F5F0EB]">
                                    <h3 className="text-xl font-bold text-black">
                                        Content
                                    </h3>

                                    {/* SHORT DESCRIPTION */}
                                    <div>
                                        <label className="block mb-2 font-semibold text-black">
                                            Short Description *
                                        </label>
                                        <textarea
                                            name="shortDescription"
                                            rows={3}
                                            maxLength={200}
                                            value={formData.shortDescription}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-[#F5F0EB] rounded-2xl resize-none focus:border-black hover:shadow-xl bg-white"
                                            placeholder="Write a brief description (max 200 characters)"
                                        />
                                        <p className="text-right text-xs font-medium text-black/60 mt-2">
                                            {charCount.shortDescription}/200
                                        </p>
                                    </div>

                                    {/* FULL CONTENT */}
                                    <TinyMCE
                                        initialValue=""
                                        onChange={handleContentChange}
                                    />
                                </div>

                                {/* FEATURED IMAGE */}
                                <div className="space-y-6 pb-8 border-b-2 border-[#F5F0EB]">
                                    <h3 className="text-xl font-bold text-black">
                                        Featured Image
                                    </h3>

                                    <div
                                        className="border-2 border-dashed border-[#F5F0EB] p-8 rounded-2xl text-center cursor-pointer hover:border-black hover:bg-[#F5F0EB]"
                                        onClick={() =>
                                            document
                                                .getElementById('featuredImage')
                                                ?.click()
                                        }
                                    >
                                        <FaCloudUploadAlt className="text-5xl mx-auto mb-3" />
                                        <p className="font-semibold">
                                            Click to upload featured image
                                        </p>
                                        <p className="text-xs text-black/60">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                        <input
                                            id="featuredImage"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFeaturedImageChange}
                                        />
                                    </div>

                                    {featuredImagePreview && (
                                        <div className="relative inline-block mt-6">
                                            <img
                                                src={featuredImagePreview}
                                                className="h-48 rounded-2xl object-cover border-2 border-[#F5F0EB] shadow-lg"
                                            />
                                            <button
                                                type="button"
                                                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg hover:scale-110"
                                                onClick={() => {
                                                    setFeaturedImagePreview(
                                                        null,
                                                    );
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        featuredImage: null,
                                                    }));
                                                }}
                                            >
                                                <FaTimes size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex justify-end gap-4 pt-6 pb-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-3 bg-black text-white rounded-2xl font-semibold hover:bg-[#F5F0EB] hover:text-black hover:shadow-lg"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-[#F5F0EB] border border-black hover:bg-black hover:text-white hover:shadow-lg text-black rounded-2xl font-semibold disabled:opacity-60"
                                    >
                                        {isSubmitting
                                            ? 'Publishing...'
                                            : 'Publish News'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </DialogContent>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddNewsForm;
