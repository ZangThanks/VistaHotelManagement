import React, { useState } from 'react';
import { FaCloudUploadAlt, FaImages, FaTimes } from 'react-icons/fa';
import { DialogContent, DialogHeader, DialogTitle } from './Dialog';
import TinyMCE from './TinyMCE';

interface AddInfoFormProps {
    onClose: () => void;
}

const AddInfoForm: React.FC<AddInfoFormProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        status: 'published',
        shortDescription: '',
        content: '',
        featuredImage: null as File | null,
        galleryImages: [] as File[],
        metaTitle: '',
        metaDescription: '',
        keywords: '',
    });

    const [charCount, setCharCount] = useState({
        shortDescription: 0,
        metaDescription: 0,
    });

    const [featuredImagePreview, setFeaturedImagePreview] = useState<
        string | null
    >(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'shortDescription') {
            setCharCount((prev) => ({
                ...prev,
                shortDescription: value.length,
            }));
        } else if (name === 'metaDescription') {
            setCharCount((prev) => ({
                ...prev,
                metaDescription: value.length,
            }));
        }
    };

    const handleContentChange = (content: string) => {
        setFormData((prev) => ({ ...prev, content }));
    };

    const handleFeaturedImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, featuredImage: file }));

            const reader = new FileReader();
            reader.onload = () => {
                setFeaturedImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryImagesChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files).slice(0, 10);
            setFormData((prev) => ({
                ...prev,
                galleryImages: [...prev.galleryImages, ...files],
            }));

            const newPreviews = [...galleryPreviews];
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    newPreviews.push(reader.result as string);
                    setGalleryPreviews([...newPreviews]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeGalleryImage = (index: number) => {
        const newGalleryImages = [...formData.galleryImages];
        const newGalleryPreviews = [...galleryPreviews];

        newGalleryImages.splice(index, 1);
        newGalleryPreviews.splice(index, 1);

        setFormData((prev) => ({ ...prev, galleryImages: newGalleryImages }));
        setGalleryPreviews(newGalleryPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            console.log('Form data submitted:', formData);
            setIsSubmitting(false);
            setSuccess(true);

            setTimeout(() => {
                onClose();
            }, 1500);
        }, 1000);
    };

    const handleSaveAsDraft = () => {
        setFormData((prev) => ({ ...prev, status: 'draft' }));
        handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    };

    return (
        <DialogContent className="max-w-5xl">
            <div className="max-h-[85vh] overflow-y-auto pr-2">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-playfair">
                        Add New Information
                    </DialogTitle>
                </DialogHeader>

                {success ? (
                    <div className="p-6 bg-green-50 text-green-600 rounded-lg text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                ></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Information Added Successfully!
                        </h3>
                        <p>
                            Your new information has been added and will be
                            available shortly.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4 pb-6 border-b border-cream">
                            <h3 className="text-lg font-playfair font-semibold">
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-2">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Title
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter title"
                                        className="w-full px-4 py-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="category"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Category
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none"
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        <option value="about">About Us</option>
                                        <option value="facilities">
                                            Facilities
                                        </option>
                                        <option value="services">
                                            Services
                                        </option>
                                        <option value="history">History</option>
                                        <option value="awards">Awards</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="status"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Status
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        required
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none"
                                    >
                                        <option value="published">
                                            Published
                                        </option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">
                                            Archived
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pb-6 border-b border-cream">
                            <h3 className="text-lg font-playfair font-semibold">
                                Content
                            </h3>
                            <div>
                                <label
                                    htmlFor="shortDescription"
                                    className="block text-sm font-medium mb-1"
                                >
                                    Short Description
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="shortDescription"
                                    name="shortDescription"
                                    required
                                    value={formData.shortDescription}
                                    onChange={handleInputChange}
                                    placeholder="Brief summary (150-200 characters)"
                                    rows={3}
                                    maxLength={200}
                                    className="w-full px-4 py-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none resize-none"
                                />
                                <div className="text-right text-xs text-gray-500">
                                    {charCount.shortDescription}/200 characters
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="content"
                                    className="block text-sm font-medium mb-1"
                                >
                                    Full Content
                                    <span className="text-red-500">*</span>
                                </label>
                                <TinyMCE
                                    initialValue=""
                                    onChange={handleContentChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pb-6 border-b border-cream">
                            <h3 className="text-lg font-playfair font-semibold">
                                Featured Image
                            </h3>
                            <div>
                                <div
                                    className="border-2 border-dashed border-cream hover:border-gold rounded-xl p-8 text-center cursor-pointer transition-colors"
                                    onClick={() =>
                                        document
                                            .getElementById('featuredImage')
                                            ?.click()
                                    }
                                >
                                    <FaCloudUploadAlt className="text-4xl text-gold mx-auto mb-3" />
                                    <p className="mb-1">
                                        Drag & drop featured image here or click
                                        to browse
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Recommended size: 1200x800px, max 2MB
                                    </p>
                                    <input
                                        type="file"
                                        id="featuredImage"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFeaturedImageChange}
                                    />
                                </div>

                                {featuredImagePreview && (
                                    <div className="mt-4">
                                        <div className="relative inline-block">
                                            <img
                                                src={featuredImagePreview}
                                                alt="Featured"
                                                className="h-40 rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
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
                                                <FaTimes size={12} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pb-6 border-b border-cream">
                            <h3 className="text-lg font-playfair font-semibold">
                                Gallery Images
                            </h3>
                            <div>
                                <div
                                    className="border-2 border-dashed border-cream hover:border-gold rounded-xl p-8 text-center cursor-pointer transition-colors"
                                    onClick={() =>
                                        document
                                            .getElementById('galleryImages')
                                            ?.click()
                                    }
                                >
                                    <FaImages className="text-4xl text-gold mx-auto mb-3" />
                                    <p className="mb-1">
                                        Drag & drop gallery images here or click
                                        to browse
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Up to 10 images, max 2MB each
                                    </p>
                                    <input
                                        type="file"
                                        id="galleryImages"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleGalleryImagesChange}
                                    />
                                </div>

                                {galleryPreviews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {galleryPreviews.map(
                                            (preview, index) => (
                                                <div
                                                    key={index}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`Gallery ${
                                                            index + 1
                                                        }`}
                                                        className="h-24 w-full rounded-lg object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                        onClick={() =>
                                                            removeGalleryImage(
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        <FaTimes size={12} />
                                                    </button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-playfair font-semibold">
                                SEO Settings
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="metaTitle"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        id="metaTitle"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleInputChange}
                                        placeholder="Title for search engines"
                                        className="w-full px-4 py-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="metaDescription"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Meta Description
                                    </label>
                                    <textarea
                                        id="metaDescription"
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleInputChange}
                                        placeholder="Description for search engines"
                                        rows={3}
                                        maxLength={160}
                                        className="w-full px-4 py-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none resize-none"
                                    />
                                    <div className="text-right text-xs text-gray-500">
                                        {charCount.metaDescription}/160
                                        characters
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="keywords"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Keywords
                                    </label>
                                    <input
                                        type="text"
                                        id="keywords"
                                        name="keywords"
                                        value={formData.keywords}
                                        onChange={handleInputChange}
                                        placeholder="Comma separated keywords"
                                        className="w-full px-4 py-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-wrap justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 border border-cream hover:bg-light rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveAsDraft}
                                className="px-6 py-2.5 bg-light hover:bg-cream border border-cream rounded-lg transition-colors"
                            >
                                Save as Draft
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-gold hover:bg-gold/90 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span>Publishing...</span>
                                    </>
                                ) : (
                                    <span>Publish Information</span>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </DialogContent>
    );
};

export default AddInfoForm;
