import React, { useState, useEffect } from 'react';
import type { Customer } from '../../types/Customer';

interface CustomerModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (
        data: Partial<Customer>,
    ) => Promise<{ success: boolean; error?: string }>;
    initialData?: Partial<Customer>; // dùng cho edit
    loading?: boolean; // trạng thái saving
}

const AddCustomerModal: React.FC<CustomerModalProps> = ({
    show,
    onClose,
    onSave,
    initialData,
    loading = false,
}) => {
    const [form, setForm] = useState<Partial<Customer>>({
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'MALE',
        memberShipLevel: 'BRONZE',
        loyaltyPoints: 0,
        reputationPoint: 100,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Validation function
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!form.fullName?.trim()) {
            newErrors.fullName = 'Họ tên không được để trống';
        }

        // Kiểm tra phải có ít nhất 1 trong 2: email hoặc phone
        const hasEmail = form.email?.trim();
        const hasPhone = form.phone?.trim();

        if (!hasEmail && !hasPhone) {
            newErrors.contact =
                'Vui lòng nhập ít nhất email hoặc số điện thoại';
        } else {
            // Nếu có email thì kiểm tra format
            if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email!)) {
                newErrors.email = 'Email không hợp lệ';
            }

            // Nếu có phone thì kiểm tra format
            if (hasPhone && !/^[0-9]{10,11}$/.test(form.phone!)) {
                newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
            }
        }

        if (!form.birthDate?.trim()) {
            newErrors.birthDate = 'Ngày sinh không được để trống';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const result = await onSave(form);
            if (result.success) {
                handleClose();
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
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleClose = () => {
        // Clear form và errors khi đóng modal
        setForm({
            fullName: '',
            email: '',
            phone: '',
            birthDate: '',
            gender: 'MALE',
            memberShipLevel: 'BRONZE',
            loyaltyPoints: 0,
            reputationPoint: 100,
        });
        setErrors({});
        onClose();
    };

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else if (show) {
            // Reset form khi mở modal mà không có initialData (thêm mới)
            setForm({
                fullName: '',
                email: '',
                phone: '',
                birthDate: '',
                gender: 'MALE',
                memberShipLevel: 'BRONZE',
                loyaltyPoints: 0,
                reputationPoint: 100,
            });
            setErrors({}); // Clear errors
        }
    }, [initialData, show]);

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {initialData
                        ? 'Chỉnh sửa khách hàng'
                        : 'Thêm khách hàng mới'}
                </h2>

                {/* Thông báo rule */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                    <p className="text-sm text-amber-700 flex items-center gap-2">
                        <i className="fas fa-info-circle"></i>
                        <span>
                            Vui lòng nhập{' '}
                            <strong>ít nhất email hoặc số điện thoại</strong> để
                            liên hệ
                        </span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Họ tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.fullName ?? ''}
                            onChange={(e) => {
                                setForm({ ...form, fullName: e.target.value });
                                if (errors.fullName)
                                    setErrors((prev) => ({
                                        ...prev,
                                        fullName: '',
                                    }));
                            }}
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
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Email{' '}
                            <span className="text-gray-400">
                                (hoặc điện thoại)
                            </span>
                        </label>
                        <input
                            type="email"
                            value={form.email ?? ''}
                            onChange={(e) => {
                                setForm({ ...form, email: e.target.value });
                                // Clear email error và contact error khi user nhập
                                setErrors((prev) => ({
                                    ...prev,
                                    email: '',
                                    contact: '',
                                }));
                            }}
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
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Điện thoại{' '}
                            <span className="text-gray-400">(hoặc email)</span>
                        </label>
                        <input
                            type="text"
                            value={form.phone ?? ''}
                            onChange={(e) => {
                                setForm({ ...form, phone: e.target.value });
                                // Clear phone error và contact error khi user nhập
                                setErrors((prev) => ({
                                    ...prev,
                                    phone: '',
                                    contact: '',
                                }));
                            }}
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
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Ngày sinh <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={form.birthDate ?? ''}
                            onChange={(e) => {
                                setForm({ ...form, birthDate: e.target.value });
                                if (errors.birthDate)
                                    setErrors((prev) => ({
                                        ...prev,
                                        birthDate: '',
                                    }));
                            }}
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
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">
                            Giới tính
                        </label>
                        <div className="flex gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="MALE"
                                    checked={form.gender === 'MALE'}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            gender: e.target
                                                .value as Customer['gender'],
                                        })
                                    }
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700">
                                    Nam
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="FEMALE"
                                    checked={form.gender === 'FEMALE'}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            gender: e.target
                                                .value as Customer['gender'],
                                        })
                                    }
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700">
                                    Nữ
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="OTHER"
                                    checked={form.gender === 'OTHER'}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            gender: e.target
                                                .value as Customer['gender'],
                                        })
                                    }
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700">
                                    Khác
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Hiển thị lỗi contact chung */}
                {errors.contact && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle"></i>
                            {errors.contact}
                        </p>
                    </div>
                )}

                {/* General Error Message */}
                {errors.general && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{errors.general}</p>
                    </div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
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
                        {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCustomerModal;
