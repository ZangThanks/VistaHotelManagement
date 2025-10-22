'use client';

import type React from 'react';
import { useState } from 'react';

const StatCard: React.FC<{
    icon: string;
    label: string;
    value: string;
    color: string;
}> = ({ icon, label, value, color }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                        {label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl ${color}`}
                >
                    <i className={`fa-solid ${icon}`}></i>
                </div>
            </div>
        </div>
    );
};

const FilterSection: React.FC<{ onFilterChange: (filter: string) => void }> = ({
    onFilterChange,
}) => {
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { id: 'all', label: 'Tất cả', icon: 'fa-list' },
        { id: 'vip', label: 'VIP', icon: 'fa-crown' },
        { id: 'gold', label: 'Gold', icon: 'fa-star' },
        { id: 'silver', label: 'Silver', icon: 'fa-medal' },
        { id: 'new', label: 'Mới', icon: 'fa-sparkles' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                Lọc khách hàng
            </h3>
            <div className="flex flex-wrap gap-3">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => {
                            setActiveFilter(filter.id);
                            onFilterChange(filter.id);
                        }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition duration-200 ${
                            activeFilter === filter.id
                                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg hover:from-amber-700 hover:to-amber-800'
                                : 'bg-[#F5F0EB] text-gray-700 hover:bg-[#EDE5DB] hover:text-amber-700 border border-[#E8DFD5]'
                        }`}
                    >
                        <i className={`fa-solid ${filter.icon}`}></i>
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const CustomerList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const customers = [
        {
            id: 1,
            customer_id: 'KH001',
            full_name: 'Nguyễn Văn An',
            email: 'nguyenvanan@email.com',
            phone: '0901234567',
            address: '123 Nguyễn Huệ, Q1, TP.HCM',
            birth_date: '1990-05-15',
            gender: 'Nam',
            user_name: 'nguyenvanan',
            user_role: 'VIP',
            loyalty_points: 1250,
            membership_level: 'Gold',
        },
        {
            id: 2,
            customer_id: 'KH002',
            full_name: 'Trần Thị Bình',
            email: 'tranthibinh@email.com',
            phone: '0912345678',
            address: '456 Lê Lợi, Q3, TP.HCM',
            birth_date: '1985-08-22',
            gender: 'Nữ',
            user_name: 'tranthibinh',
            user_role: 'Regular',
            loyalty_points: 850,
            membership_level: 'Silver',
        },
        {
            id: 3,
            customer_id: 'KH003',
            full_name: 'Lê Minh Châu',
            email: 'leminhchau@email.com',
            phone: '0923456789',
            address: '789 Trần Hưng Đạo, Q5, TP.HCM',
            birth_date: '1992-12-10',
            gender: 'Nữ',
            user_name: 'leminhchau',
            user_role: 'VIP',
            loyalty_points: 2100,
            membership_level: 'Platinum',
        },
        {
            id: 4,
            customer_id: 'KH004',
            full_name: 'Phạm Quốc Huy',
            email: 'phamquochuy@email.com',
            phone: '0934567890',
            address: '321 Nguyễn Thái Học, Q1, TP.HCM',
            birth_date: '1988-03-20',
            gender: 'Nam',
            user_name: 'phamquochuy',
            user_role: 'VIP',
            loyalty_points: 1850,
            membership_level: 'Gold',
        },
        {
            id: 5,
            customer_id: 'KH005',
            full_name: 'Võ Thị Hương',
            email: 'vothihuong@email.com',
            phone: '0945678901',
            address: '654 Lý Tự Trọng, Q1, TP.HCM',
            birth_date: '1995-07-14',
            gender: 'Nữ',
            user_name: 'vothihuong',
            user_role: 'Regular',
            loyalty_points: 420,
            membership_level: 'Silver',
        },
        {
            id: 6,
            customer_id: 'KH006',
            full_name: 'Đặng Minh Tuấn',
            email: 'dangminhuan@email.com',
            phone: '0956789012',
            address: '987 Pasteur, Q1, TP.HCM',
            birth_date: '1991-11-08',
            gender: 'Nam',
            user_name: 'dangminhtuan',
            user_role: 'VIP',
            loyalty_points: 2450,
            membership_level: 'Platinum',
        },
    ];

    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.full_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            customer.customer_id
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeFilter === 'all') return matchesSearch;
        if (activeFilter === 'vip')
            return matchesSearch && customer.user_role === 'VIP';
        if (activeFilter === 'gold')
            return matchesSearch && customer.membership_level === 'Gold';
        if (activeFilter === 'silver')
            return matchesSearch && customer.membership_level === 'Silver';
        if (activeFilter === 'new') return matchesSearch && customer.id > 4;

        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#FDFBF8] to-[#F5F0EB]">
            <div className="pt-28 px-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                            Quản lý khách hàng
                        </h1>
                        <p className="text-base text-gray-600 font-light">
                            Quản lý thông tin và dữ liệu khách hàng của resort
                            một cách hiệu quả
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard
                            icon="fa-users"
                            label="Tổng khách hàng"
                            value={customers.length.toString()}
                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                        />
                        <StatCard
                            icon="fa-crown"
                            label="Khách hàng VIP"
                            value={customers
                                .filter((c) => c.user_role === 'VIP')
                                .length.toString()}
                            color="bg-gradient-to-br from-amber-500 to-amber-600"
                        />
                        <StatCard
                            icon="fa-star"
                            label="Điểm tích lũy"
                            value={
                                (
                                    customers.reduce(
                                        (sum, c) => sum + c.loyalty_points,
                                        0,
                                    ) / 1000
                                ).toFixed(1) + 'K'
                            }
                            color="bg-gradient-to-br from-purple-500 to-purple-600"
                        />
                        <StatCard
                            icon="fa-chart-line"
                            label="Tỷ lệ hoạt động"
                            value="87%"
                            color="bg-gradient-to-br from-green-500 to-green-600"
                        />
                    </div>

                    <FilterSection onFilterChange={setActiveFilter} />

                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7 mb-8 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
                            <div className="relative flex-1 w-full">
                                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm khách hàng theo tên, mã, email..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-14 pr-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-gray-50 hover:bg-white text-sm"
                                />
                            </div>
                            <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl font-semibold transition duration-200 flex items-center gap-3 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 text-sm">
                                <i className="fa-solid fa-plus text-lg"></i>
                                Thêm khách hàng
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-[#F5F0EB] via-[#FDFBF8] to-white border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-sm font-bold text-gray-800 uppercase tracking-widest">
                                            Mã KH
                                        </th>
                                        <th className="px-8 py-5 text-left text-sm font-bold text-gray-800 uppercase tracking-widest">
                                            Họ tên
                                        </th>
                                        <th className="px-8 py-5 text-left text-sm font-bold text-gray-800 uppercase tracking-widest">
                                            Email
                                        </th>
                                        <th className="px-8 py-5 text-left text-sm font-bold text-gray-800 uppercase tracking-widest">
                                            Điện thoại
                                        </th>
                                        <th className="px-8 py-5 text-left text-sm font-bold text-gray-800 uppercase tracking-widest">
                                            Hạng thành viên
                                        </th>
                                        <th className="px-8 py-5 text-left text-sm font-bold text-gray-800 uppercase tracking-widest">
                                            Điểm tích lũy
                                        </th>
                                        <th className="px-8 py-5 text-center text-sm font-bold text-gray-800 uppercase tracking-widest">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredCustomers.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="hover:bg-gradient-to-r hover:from-[#FDFBF8] hover:to-[#F5F0EB] transition duration-150 group"
                                        >
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className="font-bold text-gray-900 text-sm">
                                                    {customer.customer_id}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition text-base">
                                                        {customer.full_name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 text-sm">
                                                            {customer.full_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-light">
                                                            {customer.user_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                {customer.email}
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                {customer.phone}
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span
                                                    className={`px-4 py-2 rounded-full text-xs font-bold inline-block ${
                                                        customer.membership_level ===
                                                        'Platinum'
                                                            ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800'
                                                            : customer.membership_level ===
                                                              'Gold'
                                                            ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800'
                                                            : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800'
                                                    }`}
                                                >
                                                    {customer.membership_level}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-star text-amber-500 text-base"></i>
                                                    <span className="font-bold text-gray-900 text-sm">
                                                        {customer.loyalty_points.toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition duration-200">
                                                    <button
                                                        className="p-2.5 text-amber-600 hover:bg-amber-100 rounded-lg transition duration-200 hover:scale-110"
                                                        title="Xem chi tiết"
                                                    >
                                                        <i className="fa-solid fa-eye text-lg"></i>
                                                    </button>
                                                    <button
                                                        className="p-2.5 text-amber-600 hover:bg-amber-100 rounded-lg transition duration-200 hover:scale-110"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <i className="fa-solid fa-pen text-lg"></i>
                                                    </button>
                                                    <button
                                                        className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition duration-200 hover:scale-110"
                                                        title="Xóa"
                                                    >
                                                        <i className="fa-solid fa-trash text-lg"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-6 border-t-2 border-gray-200 bg-gradient-to-r from-[#FDFBF8] to-white flex items-center justify-between">
                            <div className="text-xs text-gray-700 font-medium">
                                Hiển thị{' '}
                                <span className="font-bold text-gray-900">
                                    {filteredCustomers.length}
                                </span>{' '}
                                trong tổng số{' '}
                                <span className="font-bold text-gray-900">
                                    {customers.length}
                                </span>{' '}
                                khách hàng
                            </div>
                            <div className="flex gap-3">
                                <button className="px-5 py-2.5 border-2 border-[#E8DFD5] rounded-lg hover:bg-[#F5F0EB] hover:border-amber-500 transition duration-200 text-xs font-semibold text-gray-700 hover:text-amber-700">
                                    <i className="fa-solid fa-chevron-left mr-2"></i>
                                    Trước
                                </button>
                                <button className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition duration-200 text-xs font-semibold shadow-md hover:shadow-lg">
                                    1
                                </button>
                                <button className="px-5 py-2.5 border-2 border-[#E8DFD5] rounded-lg hover:bg-[#F5F0EB] hover:border-amber-500 transition duration-200 text-xs font-semibold text-gray-700 hover:text-amber-700">
                                    Sau
                                    <i className="fa-solid fa-chevron-right ml-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />
        </div>
    );
};

export default CustomerList;
