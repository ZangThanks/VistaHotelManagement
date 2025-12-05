/* eslint-disable */
import React, { useState, useEffect } from 'react';
import type { Customer, Gender, MemberShipLevel } from '../../types/Customer';

interface EditCustomerModalProps {
    show: boolean;
    customer: Customer | null;
    onClose: () => void;
    onSave: (
        updated: Customer,
    ) => Promise<{ success: boolean; error?: string }>;
    loading?: boolean; // trạng thái saving
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
    show,
    customer,
    onClose,
    onSave,
    loading = false,
}) => {
    const [form, setForm] = useState<Partial<Customer>>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Khi mở modal, load dữ liệu từ customer
    useEffect(() => {
        if (customer) {
            // Đảm bảo format ngày đúng cho input date (YYYY-MM-DD)
            const formatDate = (dateStr: string | null | undefined): string => {
                if (!dateStr || dateStr === null) {
                    return '';
                }

                // Convert to string nếu không phải string
                const dateString = String(dateStr);

                // Nếu đã đúng format YYYY-MM-DD thì giữ nguyên
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                    return dateString;
                }

                // Thử các format khác
                try {
                    let date: Date;

                    // Nếu là timestamp (số)
                    if (/^\d+$/.test(dateString)) {
                        date = new Date(parseInt(dateString));
                    }
                    // Nếu là format DD/MM/YYYY
                    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
                        const [day, month, year] = dateString.split('/');
                        date = new Date(`${year}-${month}-${day}`);
                    }
                    // Nếu là format MM/DD/YYYY
                    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
                        date = new Date(dateString);
                    }
                    // Thử parse trực tiếp
                    else {
                        date = new Date(dateString);
                    }

                    if (!isNaN(date.getTime())) {
                        const formatted = date.toISOString().split('T')[0];
                        return formatted;
                    }
                } catch (e) {
                    console.error('Invalid date format:', dateString, e);
                }

                return '';
            };

            setForm({
                ...customer,
                birthDate: formatDate(customer.birthDate),
                joinedDate: formatDate(customer.joinedDate),
                loyaltyPoints: customer.loyaltyPoints ?? 0,
                reputationPoint: customer.reputationPoint ?? 0,
            });

            // Clear errors khi load data mới
            setErrors({});
        }
    }, [customer]);

    if (!show || !customer) return null;

    const handleChange = (field: keyof Customer, value: unknown) => {
        setForm((prev) => ({
            ...prev,
            [field]: value as never,
        }));
        // Clear error khi user input
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    // Validation function
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!form.fullName?.trim()) {
            newErrors.fullName = 'Họ tên không được để trống';
        }

        if (!form.email?.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Phone không bắt buộc nhưng nếu có thì phải đúng format
        if (form.phone?.trim() && !/^[0-9]{10,11}$/.test(form.phone)) {
            newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
        }

        if (!form.birthDate?.trim()) {
            newErrors.birthDate = 'Ngày sinh không được để trống';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        const payload: Customer = {
            ...customer, // Bắt đầu từ customer gốc để đảm bảo có đầy đủ thông tin
            ...form, // Override với thông tin từ form
            id:
                customer.id && customer.id.trim() !== ''
                    ? customer.id
                    : customer.id, // Đảm bảo ID hợp lệ
            birthDate: form.birthDate ? (form.birthDate as string) : null,
            joinedDate: form.joinedDate
                ? (form.joinedDate as string)
                : customer.joinedDate, // giữ nguyên ngày tham gia
            loyaltyPoints: Number(form.loyaltyPoints ?? 0),
            reputationPoint: Number(form.reputationPoint ?? 0),
            avatarUrl: form.avatarUrl ?? null,
        };

        console.log('EditCustomerModal - Payload being sent:', payload);
        console.log('EditCustomerModal - Original customer ID:', customer.id);
        console.log('EditCustomerModal - Payload ID:', payload.id);

        const result = await onSave(payload);
        if (result.success) {
            onClose();
        } else if (result.error) {
            // Hiển thị lỗi từ API trong modal
            const newErrors: { [key: string]: string } = {};

            if (result.error.includes('Email này đã được sử dụng')) {
                newErrors.email = result.error;
            } else if (
                result.error.includes('Số điện thoại này đã được sử dụng')
            ) {
                newErrors.phone = result.error;
            } else if (
                result.error.includes('Tên đăng nhập này đã được sử dụng')
            ) {
                newErrors.general = result.error;
            } else if (
                result.error.includes('Thông tin khách hàng đã tồn tại')
            ) {
                newErrors.general = result.error;
            } else {
                newErrors.general = result.error;
            }

            setErrors(newErrors);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <i className="fa-solid fa-pen-to-square text-amber-600"></i>
                    Cập nhật thông tin khách hàng
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Họ tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.fullName || ''}
                            onChange={(e) =>
                                handleChange('fullName', e.target.value)
                            }
                            className={`w-full mt-1 p-2 border rounded-lg text-sm ${
                                errors.fullName
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300'
                            }`}
                            placeholder="Nhập họ tên"
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.fullName}
                            </p>
                        )}
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Ngày sinh <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={form.birthDate || ''}
                            onChange={(e) =>
                                handleChange(
                                    'birthDate',
                                    e.target.value || null,
                                )
                            }
                            className={`w-full mt-1 p-2 border rounded-lg text-sm ${
                                errors.birthDate
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300'
                            }`}
                        />
                        {errors.birthDate && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.birthDate}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Số điện thoại{' '}
                            <span className="text-gray-400">(tùy chọn)</span>
                        </label>
                        <input
                            type="text"
                            value={form.phone || ''}
                            onChange={(e) =>
                                handleChange('phone', e.target.value)
                            }
                            className={`w-full mt-1 p-2 border rounded-lg text-sm ${
                                errors.phone
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300'
                            }`}
                            placeholder="0399754293"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={form.email || ''}
                            onChange={(e) =>
                                handleChange('email', e.target.value)
                            }
                            className={`w-full mt-1 p-2 border rounded-lg text-sm ${
                                errors.email
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300'
                            }`}
                            placeholder="example@gmail.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">
                            Địa chỉ
                        </label>
                        <input
                            type="text"
                            value={form.address || ''}
                            onChange={(e) =>
                                handleChange('address', e.target.value)
                            }
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                        />
                    </div>

                    {/* Gender */}
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">
                            Giới tính
                        </label>
                        <div className="flex items-center gap-6 mt-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="MALE"
                                    checked={form.gender === 'MALE'}
                                    onChange={() =>
                                        handleChange('gender', 'MALE')
                                    }
                                />
                                <span>Nam</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="FEMALE"
                                    checked={form.gender === 'FEMALE'}
                                    onChange={() =>
                                        handleChange('gender', 'FEMALE')
                                    }
                                />
                                <span>Nữ</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="OTHER"
                                    checked={form.gender === 'OTHER'}
                                    onChange={() =>
                                        handleChange('gender', 'OTHER')
                                    }
                                />
                                <span>Khác</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* General Error Message */}
                {errors.general && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{errors.general}</p>
                    </div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-4 w-4 text-white"
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
                        )}
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <i className="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
        </div>
    );
};

export default EditCustomerModal;
