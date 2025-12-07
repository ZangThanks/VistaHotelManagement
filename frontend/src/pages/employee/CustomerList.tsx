/* eslint-disable */
import type React from 'react';
import { useEffect, useState } from 'react';
import AddCustomerModal from '../../components/customer/AddCustomerModal';
import EditCustomerModal from '../../components/customer/EditCustomerModal';
import type { Customer } from '../../types/Customer';
import { getAll, saveCustomer } from '../../services/customerService';
import { useToastContext } from '../../hooks/useToastContext';

type StatCardProps = {
    icon: string;
    label: string;
    value: React.ReactNode;
    color?: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
                <p className="text-gray-500 text-xs font-semibold mb-1 sm:mb-2 uppercase tracking-wider truncate">
                    {label}
                </p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900">
                    {value}
                </p>
            </div>
            <div
                className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl shadow-md ${color} flex-shrink-0 ml-2`}
            >
                <i className={`fa-solid ${icon}`}></i>
            </div>
        </div>
    </div>
);

type FilterSectionProps = {
    onFilterChange: (filterId: string) => void;
};

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
    const [active, setActive] = useState('all');
    const filters = [
        { id: 'all', label: 'Tất cả', icon: 'fa-list' },
        { id: 'bronze', label: 'Bronze', icon: 'fa-medal' },
        { id: 'silver', label: 'Silver', icon: 'fa-certificate' },
        { id: 'gold', label: 'Gold', icon: 'fa-star' },
        { id: 'platinum', label: 'Platinum', icon: 'fa-gem' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 mb-4 sm:mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">
                Filter Customers
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
                {filters.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => {
                            setActive(f.id);
                            onFilterChange(f.id);
                        }}
                        className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-200 text-xs sm:text-sm ${
                            active === f.id
                                ? 'bg-[#b9ad96] text-white border border-[#b9ad96] shadow-lg '
                                : 'bg-gray-50 text-gray-700 border border-[#b9ad96] hover:text-white hover:bg-[#d5c8ae] transition-all duration-200'
                        }`}
                    >
                        <i className={`fa-solid ${f.icon}`}></i>
                        <span className="hidden xs:inline">{f.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const toast = useToastContext();

    const handleEditCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowEditModal(true);
    };
    const handleSaveEdit = async (
        updated: Customer,
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            setSaving(true);

            // Validation - check trùng email/phone
            if (updated.email && updated.email.trim() !== '') {
                const existingByEmail = customers.find(
                    (c) => c.email === updated.email && c.id !== updated.id,
                );
                if (existingByEmail) {
                    return {
                        success: false,
                        error: 'Email already exists',
                    };
                }
            }

            if (updated.phone && updated.phone.trim() !== '') {
                const existingByPhone = customers.find(
                    (c) => c.phone === updated.phone && c.id !== updated.id,
                );
                if (existingByPhone) {
                    return {
                        success: false,
                        error: 'Phone number already exists',
                    };
                }
            }

            // Gọi API để cập nhật khách hàng
            const savedCustomer = await saveCustomer(updated);

            if (savedCustomer) {
                // Cập nhật trong danh sách local sau khi save thành công
                setCustomers((prev) =>
                    prev.map((c) => (c.id === updated.id ? savedCustomer : c)),
                );

                // Hiển thị thông báo thành công
                toast.success('Update customer successfully!');
                return { success: true };
            } else {
                throw new Error('Cannot update customer information');
            }
        } catch (error) {
            console.error('CustomerList - Error updating customer:', error);

            // Xử lý các loại lỗi khác nhau cho cập nhật
            let errorMessage = 'Error updating customer';

            if (error instanceof Error) {
                errorMessage = error.message;
                console.error('CustomerList - Error message:', errorMessage);

                if (errorMessage.includes('Email already exists')) {
                    return {
                        success: false,
                        error: 'Email này đã được sử dụng bởi khách hàng khác!',
                    };
                } else if (errorMessage.includes('Phone already exists')) {
                    return {
                        success: false,
                        error: 'Số điện thoại này đã được sử dụng bởi khách hàng khác!',
                    };
                } else if (errorMessage.includes('Username already exists')) {
                    return {
                        success: false,
                        error: 'Tên đăng nhập này đã được sử dụng!',
                    };
                } else if (
                    errorMessage.includes('duplicate') ||
                    errorMessage.includes('trùng') ||
                    errorMessage.includes('already exists')
                ) {
                    return {
                        success: false,
                        error: 'Thông tin khách hàng đã tồn tại trong hệ thống!',
                    };
                } else if (errorMessage.includes('400')) {
                    toast.error(
                        'Thông tin không hợp lệ. Vui lòng kiểm tra lại!',
                    );
                    return { success: false };
                } else if (errorMessage.includes('500')) {
                    toast.error('Lỗi hệ thống. Vui lòng thử lại sau!');
                    return { success: false };
                } else if (
                    errorMessage.includes('network') ||
                    errorMessage.includes('kết nối')
                ) {
                    toast.error(
                        'Không thể kết nối đến server. Kiểm tra kết nối mạng!',
                    );
                    return { success: false };
                }
            }

            toast.error(errorMessage);
            return { success: false };
        } finally {
            setSaving(false);
        }
    };

    const handleAddCustomer = async (
        data: Partial<Customer>,
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            setSaving(true);

            // Frontend validation
            if (data.email && data.email.trim() !== '') {
                const existingByEmail = customers.find(
                    (c) => c.email === data.email,
                );
                if (existingByEmail) {
                    return {
                        success: false,
                        error: 'Email already exists!',
                    };
                }
            }

            if (data.phone && data.phone.trim() !== '') {
                const existingByPhone = customers.find(
                    (c) => c.phone === data.phone,
                );
                if (existingByPhone) {
                    return {
                        success: false,
                        error: 'Phone number already exists!',
                    };
                }
            }

            const newCustomer: Omit<Customer, 'id'> = {
                userName: data.email?.split('@')[0] || `user${Date.now()}`,
                password: '123456',
                email: data.email ?? '',
                phone: data.phone ?? '',
                avatarUrl: data.avatarUrl ?? '',
                fullName: data.fullName ?? '',
                address: data.address ?? '',
                userRole: 'CUSTOMER',
                birthDate: data.birthDate ?? '',
                gender: data.gender ?? '',
                joinedDate: new Date().toISOString().split('T')[0],
                loyaltyPoints: data.loyaltyPoints ?? 0,
                memberShipLevel: data.memberShipLevel ?? 'BRONZE',
                reputationPoint: data.reputationPoint ?? 100,
            };

            if ('id' in newCustomer) {
                delete (newCustomer as any).id;
            }

            // Gọi API
            const savedCustomer = await saveCustomer(newCustomer);

            if (savedCustomer) {
                setCustomers((prev) => [...prev, savedCustomer]);

                toast.success('Thêm khách hàng thành công!');
                return { success: true };
            } else {
                throw new Error('Cannot add new customer');
            }
        } catch (error) {
            console.error('CustomerList - Error adding customer:', error);

            // Xử lý các loại lỗi khác nhau
            let errorMessage = 'Error adding customer';

            if (error instanceof Error) {
                errorMessage = error.message;
                console.error('CustomerList - Error message:', errorMessage);

                // Kiểm tra các lỗi cụ thể từ backend
                if (errorMessage.includes('Email already exists')) {
                    return {
                        success: false,
                        error: 'Email này đã được sử dụng bởi khách hàng khác!',
                    };
                } else if (errorMessage.includes('Phone already exists')) {
                    return {
                        success: false,
                        error: 'Số điện thoại này đã được sử dụng bởi khách hàng khác!',
                    };
                } else if (errorMessage.includes('Username already exists')) {
                    return {
                        success: false,
                        error: 'Tên đăng nhập này đã được sử dụng!',
                    };
                } else if (
                    errorMessage.includes('duplicate') ||
                    errorMessage.includes('trùng') ||
                    errorMessage.includes('already exists')
                ) {
                    return {
                        success: false,
                        error: 'Thông tin khách hàng đã tồn tại trong hệ thống!',
                    };
                } else if (errorMessage.includes('400')) {
                    toast.error(
                        'Thông tin không hợp lệ. Vui lòng kiểm tra lại!',
                    );
                    return { success: false };
                } else if (errorMessage.includes('500')) {
                    toast.error('Lỗi hệ thống. Vui lòng thử lại sau!');
                    return { success: false };
                } else if (
                    errorMessage.includes('network') ||
                    errorMessage.includes('kết nối')
                ) {
                    toast.error(
                        'Không thể kết nối đến server. Kiểm tra kết nối mạng!',
                    );
                    return { success: false };
                }
            }

            toast.error(errorMessage);
            return { success: false };
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await getAll();
                setCustomers(data ?? []);
            } catch (err) {
                setError('Cannot load customer list');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filtered = customers.filter((c) => {
        const name = c.fullName ?? '';
        const email = c.email ?? '';
        const id = c.id ?? '';
        const matchSearch =
            name.toLowerCase().includes(search.toLowerCase()) ||
            email.toLowerCase().includes(search.toLowerCase()) ||
            id.toLowerCase().includes(search.toLowerCase());
        if (filter === 'all') return matchSearch;
        return (
            matchSearch && (c.memberShipLevel ?? '').toLowerCase() === filter
        );
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCustomers = filtered.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filter]);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-700 text-sm sm:text-lg font-semibold px-4">
                        Loading customer data...
                    </p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
                <div className="text-center">
                    <i className="fa-solid fa-triangle-exclamation text-4xl sm:text-6xl text-red-500 mb-4"></i>
                    <p className="text-red-600 text-lg sm:text-xl font-semibold px-4">
                        {error}
                    </p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
            <div className="pt-4 sm:pt-8 px-3 sm:px-6 pb-6 sm:pb-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-4 sm:mb-8">
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight">
                            Management Customers
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Manage customer information and data effectively
                        </p>
                    </div>

                    {/* Thống kê - Responsive Grid */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <StatCard
                            icon="fa-users"
                            label="Customers"
                            value={customers.length.toString()}
                            color="bg-gradient-to-br from-gray-800 to-gray-900"
                        />
                        <StatCard
                            icon="fa-medal"
                            label="Bronze Members"
                            value={customers
                                .filter((c) => c.memberShipLevel === 'BRONZE')
                                .length.toString()}
                            color="bg-gradient-to-br from-orange-600 to-orange-700"
                        />
                        <StatCard
                            icon="fa-certificate"
                            label="Silver Members"
                            value={customers
                                .filter((c) => c.memberShipLevel === 'SILVER')
                                .length.toString()}
                            color="bg-gradient-to-br from-gray-400 to-gray-500"
                        />
                        <StatCard
                            icon="fa-star"
                            label="Gold Members"
                            value={customers
                                .filter((c) => c.memberShipLevel === 'GOLD')
                                .length.toString()}
                            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
                        />
                        <StatCard
                            icon="fa-gem"
                            label="Platinum Members"
                            value={customers
                                .filter((c) => c.memberShipLevel === 'PLATINUM')
                                .length.toString()}
                            color="bg-gradient-to-br from-gray-600 to-gray-700"
                        />
                    </div>

                    {/* Bộ lọc */}
                    <FilterSection onFilterChange={setFilter} />

                    {/* Thanh tìm kiếm */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                            <div className="relative flex-1 w-full">
                                <i className="fa-solid fa-magnifying-glass absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Search customers by name, code, email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 hover:bg-white text-sm"
                                />
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-[#988f7d] hover:bg-[#b9ad96] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm whitespace-nowrap"
                            >
                                <i className="fa-solid fa-plus"></i>
                                <span className="hidden sm:inline">
                                    Add Customer
                                </span>
                                <span className="sm:hidden">Thêm</span>
                            </button>
                        </div>
                    </div>

                    {/* Bảng dữ liệu - Desktop Table & Mobile Cards */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Desktop Table View - Hidden on small screens */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Customer ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Membership Level
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Reputation
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentCustomers.map((c) => (
                                        <tr
                                            key={c.id}
                                            className="hover:bg-gray-50 transition-all duration-200 group"
                                        >
                                            <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                                                {c.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {c.avatarUrl ? (
                                                        <img
                                                            src={c.avatarUrl}
                                                            className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-gray-100"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-[#b9ad96] flex items-center justify-center text-white font-bold shadow-md ring-2 ring-gray-100">
                                                            {(c.fullName ?? '?')
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {c.fullName}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {c.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                {c.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                {c.phone}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block shadow-sm ${
                                                        c.memberShipLevel ===
                                                        'PLATINUM'
                                                            ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900'
                                                            : c.memberShipLevel ===
                                                              'GOLD'
                                                            ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-900'
                                                            : c.memberShipLevel ===
                                                              'SILVER'
                                                            ? 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700'
                                                            : 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-900'
                                                    }`}
                                                >
                                                    {c.memberShipLevel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-900 font-semibold bg-gray-100 px-3 py-1 rounded-lg">
                                                    {c.reputationPoint}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        aria-label="Xem chi tiết"
                                                        className="p-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 hover:scale-110"
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        aria-label="Chỉnh sửa"
                                                        onClick={() =>
                                                            handleEditCustomer(
                                                                c,
                                                            )
                                                        }
                                                        className="p-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 hover:scale-110"
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View - Visible on small screens */}
                        <div className="lg:hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
                            {currentCustomers.map((c) => (
                                <div
                                    key={c.id}
                                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-all duration-200"
                                >
                                    {/* Header with avatar and basic info */}
                                    <div className="flex items-start gap-3 mb-3">
                                        {c.avatarUrl ? (
                                            <img
                                                src={c.avatarUrl}
                                                className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-white"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-[#b9ad96] flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                                                {(c.fullName ?? '?')
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-gray-900 truncate">
                                                {c.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-600 truncate">
                                                {c.id}
                                            </p>
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 ${
                                                    c.memberShipLevel ===
                                                    'PLATINUM'
                                                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900'
                                                        : c.memberShipLevel ===
                                                          'GOLD'
                                                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-900'
                                                        : c.memberShipLevel ===
                                                          'SILVER'
                                                        ? 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700'
                                                        : 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-900'
                                                }`}
                                            >
                                                {c.memberShipLevel}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                aria-label="Xem chi tiết"
                                                className="p-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all duration-200"
                                            >
                                                <i className="fa-solid fa-eye text-sm"></i>
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Chỉnh sửa"
                                                onClick={() =>
                                                    handleEditCustomer(c)
                                                }
                                                className="p-2 text-gray-700 hover:bg-green-100 hover:text-green-600 rounded-lg transition-all duration-200"
                                            >
                                                <i className="fa-solid fa-pen text-sm"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contact info */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <i className="fa-solid fa-envelope text-gray-400 w-4"></i>
                                            <span className="text-gray-700 truncate">
                                                {c.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="fa-solid fa-phone text-gray-400 w-4"></i>
                                            <span className="text-gray-700">
                                                {c.phone}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="fa-solid fa-star text-gray-400 w-4"></i>
                                            <span className="text-gray-700">
                                                Uy tín:{' '}
                                                <span className="font-semibold">
                                                    {c.reputationPoint}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-3 sm:px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 text-sm text-gray-700 font-semibold flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                            <span>
                                Show {startIndex + 1}-
                                {Math.min(endIndex, filtered.length)} /{' '}
                                {filtered.length} customers
                            </span>

                            {/* Phân trang */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2">
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(1, prev - 1),
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className={`w-6 h-6 p-4 rounded-3xl flex items-center justify-center transition-all duration-200 ${
                                            currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-900 hover:bg-gray-900 hover:text-white shadow-sm hover:shadow-md'
                                        }`}
                                    >
                                        <i className="fa-solid fa-chevron-left text-xs sm:text-sm"></i>
                                    </button>

                                    {/* Simple pagination - chỉ hiển thị số trang */}
                                    <div className="flex items-center">
                                        <span className="text-gray-700 px-3 py-1">
                                            {currentPage} / {totalPages}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(totalPages, prev + 1),
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`w-6 h-6 p-4 rounded-3xl flex items-center justify-center transition-all duration-200 ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-900 hover:bg-gray-900 hover:text-white shadow-sm hover:shadow-md'
                                        }`}
                                    >
                                        <i className="fa-solid fa-chevron-right text-xs sm:text-sm"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />
            <AddCustomerModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleAddCustomer}
                loading={saving}
            />
            <EditCustomerModal
                show={showEditModal}
                customer={selectedCustomer}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveEdit}
                loading={saving}
            />
        </div>
    );
}
