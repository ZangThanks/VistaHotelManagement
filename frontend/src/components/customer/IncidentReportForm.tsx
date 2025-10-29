import React, { useState } from 'react';
import type {
    IncidentCategory,
    IncidentPriority,
    IncidentFormData,
} from '../../types/Incident';
import FloatingInput from '../FloatingInput';
import Button from '../Button';
import { Upload, X, AlertCircle } from 'lucide-react';

interface IncidentReportFormProps {
    bookingId: string;
    onSubmit: (data: IncidentFormData) => Promise<void>;
    onCancel?: () => void;
}

const CATEGORIES: { value: IncidentCategory; label: string; icon: string }[] = [
    { value: 'ROOM_MAINTENANCE', label: 'Bảo trì phòng', icon: '🔧' },
    { value: 'CLEANLINESS', label: 'Vệ sinh', icon: '🧹' },
    { value: 'NOISE', label: 'Tiếng ồn', icon: '🔊' },
    { value: 'EQUIPMENT_FAILURE', label: 'Thiết bị hỏng', icon: '⚠️' },
    { value: 'SAFETY_SECURITY', label: 'An toàn & Bảo mật', icon: '🔒' },
    { value: 'SERVICE_COMPLAINT', label: 'Khiếu nại dịch vụ', icon: '📋' },
    { value: 'OTHER', label: 'Khác', icon: '💬' },
];

const PRIORITIES: { value: IncidentPriority; label: string; color: string }[] =
    [
        {
            value: 'LOW',
            label: 'Thấp',
            color: 'bg-green-100 text-green-800 border-green-300',
        },
        {
            value: 'MEDIUM',
            label: 'Trung bình',
            color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        },
        {
            value: 'HIGH',
            label: 'Cao',
            color: 'bg-orange-100 text-orange-800 border-orange-300',
        },
        {
            value: 'URGENT',
            label: 'Khẩn cấp',
            color: 'bg-red-100 text-red-800 border-red-300',
        },
        {
            value: 'CRITICAL',
            label: 'Nghiêm trọng',
            color: 'bg-red-200 text-red-900 border-red-400',
        },
    ];

const IncidentReportForm: React.FC<IncidentReportFormProps> = ({
    bookingId,
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState<IncidentFormData>({
        bookingId,
        category: 'OTHER',
        priority: 'MEDIUM',
        title: '',
        description: '',
    });

    const [, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (
        field: keyof IncidentFormData,
        value: string,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    image: 'Kích thước ảnh không được vượt quá 5MB',
                }));
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors((prev) => ({
                    ...prev,
                    image: 'Vui lòng chọn file ảnh hợp lệ',
                }));
                return;
            }

            setImageFile(file);
            setErrors((prev) => ({ ...prev, image: '' }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Vui lòng nhập tiêu đề';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Vui lòng mô tả chi tiết sự cố';
        }

        if (formData.description.trim().length < 10) {
            newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting incident report:', error);
            setErrors({
                submit: 'Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Loại sự cố <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            type="button"
                            onClick={() =>
                                handleInputChange('category', cat.value)
                            }
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                formData.category === cat.value
                                    ? 'border-[#CCBDA3] bg-[#CCBDA3]/10'
                                    : 'border-gray-200 hover:border-[#CCBDA3]/50'
                            }`}
                        >
                            <div className="text-2xl mb-1">{cat.icon}</div>
                            <div className="text-xs font-medium text-gray-700">
                                {cat.label}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Priority Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mức độ ưu tiên <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {PRIORITIES.map((priority) => (
                        <button
                            key={priority.value}
                            type="button"
                            onClick={() =>
                                handleInputChange('priority', priority.value)
                            }
                            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                                formData.priority === priority.value
                                    ? priority.color + ' border-current'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            {priority.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Title */}
            <div>
                <FloatingInput
                    label="Tiêu đề"
                    type="text"
                    value={formData.title}
                    onChange={(value) => handleInputChange('title', value)}
                />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) =>
                        handleInputChange('description', e.target.value)
                    }
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#CCBDA3] focus:border-transparent resize-none ${
                        errors.description
                            ? 'border-red-500'
                            : 'border-gray-300'
                    }`}
                    placeholder="Vui lòng mô tả chi tiết sự cố đã xảy ra..."
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                    </p>
                )}
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh (tùy chọn)
                </label>
                {!imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">
                                    Nhấp để tải ảnh lên
                                </span>{' '}
                                hoặc kéo thả
                            </p>
                            <p className="text-xs text-gray-400">
                                PNG, JPG, GIF (MAX. 5MB)
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>
                ) : (
                    <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                {onCancel && (
                    <Button
                        type="button"
                        onClick={onCancel}
                        text="Hủy"
                        className="flex-1"
                        color="bg-gray-200"
                        textColor="text-gray-700"
                        disabled={isSubmitting}
                    />
                )}
                <Button
                    type="submit"
                    text={isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
                    className="flex-1"
                    color="bg-[#CCBDA3]"
                    textColor="text-white"
                    disabled={isSubmitting}
                />
            </div>
        </form>
    );
};

export default IncidentReportForm;
