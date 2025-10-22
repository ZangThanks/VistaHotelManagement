/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { getAll } from '../../services/CustomerService';

// Component thống kê nhỏ
type StatCardProps = {
    icon: string;
    label: string;
    value: React.ReactNode;
    color?: string;
};
export interface Customer {
    id: string;
    userName: string;
    password: string;
    email: string;
    phone: string;
    fullName: string;
    address: string;
    userRole: string; 
    birthDate: string;
    gender: string; 
    joinedDate: string;
    loyaltyPoints: number;
    memberShipLevel: string; 
}


const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
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

type FilterSectionProps = {
    onFilterChange: (filterId: string) => void;
};

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
    const [active, setActive] = useState('all');
    const filters = [
        { id: 'all', label: 'Tất cả', icon: 'fa-list' },
        { id: 'silver', label: 'Silver', icon: 'fa-medal' },
        { id: 'gold', label: 'Gold', icon: 'fa-star' },
        { id: 'platinum', label: 'Platinum', icon: 'fa-gem' },
        { id: 'new', label: 'Mới', icon: 'fa-user-plus' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                Lọc khách hàng
            </h3>
            <div className="flex flex-wrap gap-3">
                {filters.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => {
                            setActive(f.id);
                            onFilterChange(f.id);
                        }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition duration-200 ${
                            active === f.id
                                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg hover:from-amber-700 hover:to-amber-800'
                                : 'bg-[#F5F0EB] text-gray-700 hover:bg-[#EDE5DB] hover:text-amber-700 border border-[#E8DFD5]'
                        }`}
                    >
                        <i className={`fa-solid ${f.icon}`}></i>
                        {f.label}
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
    const [error, setError] = useState('');

    // Gọi API thật
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await getAll();
                setCustomers(data ?? []);
            } catch (err) {
                setError('Không thể tải danh sách khách hàng');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    // Lọc dữ liệu theo search + filter
    const filtered = customers.filter((c) => {
        const name = c.fullName ?? '';
        const email = c.email ?? '';
        const id = c.id ?? '';
        const matchSearch =
            name.toLowerCase().includes(search.toLowerCase()) ||
            email.toLowerCase().includes(search.toLowerCase()) ||
            id.toLowerCase().includes(search.toLowerCase());
        if (filter === 'all') return matchSearch;
        if (filter === 'new')
            return matchSearch && c.joinedDate === '2025-10-20';
        return (
            matchSearch && (c.memberShipLevel ?? '').toLowerCase() === filter
        );
    });

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-gray-700 text-lg">
                Đang tải dữ liệu khách hàng...
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen text-red-600 text-lg">
                {error}
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#FDFBF8] to-[#F5F0EB]">
            <div className="pt-28 px-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    {/* Tiêu đề */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                            Quản lý khách hàng
                        </h1>
                        <p className="text-base text-gray-600 font-light">
                            Quản lý thông tin và dữ liệu khách hàng một cách
                            hiệu quả
                        </p>
                    </div>

                    {/* Thống kê */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard
                            icon="fa-users"
                            label="Tổng khách hàng"
                            value={customers.length.toString()}
                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                        />
                        <StatCard
                            icon="fa-star"
                            label="Thành viên Gold"
                            value={customers
                                .filter((c) => c.memberShipLevel === 'GOLD')
                                .length.toString()}
                            color="bg-gradient-to-br from-amber-500 to-amber-600"
                        />
                        <StatCard
                            icon="fa-gem"
                            label="Thành viên Platinum"
                            value={customers
                                .filter((c) => c.memberShipLevel === 'PLATINUM')
                                .length.toString()}
                            color="bg-gradient-to-br from-purple-500 to-purple-600"
                        />
                        <StatCard
                            icon="fa-coins"
                            label="Tổng điểm tích lũy"
                            value={
                                (
                                    customers.reduce(
                                        (sum, c) =>
                                            sum + (c.loyaltyPoints || 0),
                                        0,
                                    ) / 1000
                                ).toFixed(1) + 'K'
                            }
                            color="bg-gradient-to-br from-green-500 to-green-600"
                        />
                    </div>

                    {/* Bộ lọc */}
                    <FilterSection onFilterChange={setFilter} />

                    {/* Thanh tìm kiếm */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7 mb-8">
                        <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
                            <div className="relative flex-1 w-full">
                                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm khách hàng theo tên, mã, email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-14 pr-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-gray-50 hover:bg-white text-sm"
                                />
                            </div>
                            <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl font-semibold transition duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm">
                                <i className="fa-solid fa-plus text-lg"></i>{' '}
                                Thêm khách hàng
                            </button>
                        </div>
                    </div>

                    {/* Bảng dữ liệu */}
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
                                    {filtered.map((c) => (
                                        <tr
                                            key={c.id}
                                            className="hover:bg-gradient-to-r hover:from-[#FDFBF8] hover:to-[#F5F0EB] transition duration-150 group"
                                        >
                                            <td className="px-8 py-5 font-bold text-gray-900 text-sm">
                                                {c.id}
                                            </td>
                                            <td className="px-8 py-5 flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-md text-base">
                                                    {(c.fullName ?? '?').charAt(
                                                        0,
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">
                                                        {c.fullName}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-light">
                                                        {c.userName}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-gray-600 font-medium">
                                                {c.email}
                                            </td>
                                            <td className="px-8 py-5 text-sm text-gray-600 font-medium">
                                                {c.phone}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span
                                                    className={`px-4 py-2 rounded-full text-xs font-bold inline-block ${
                                                        c.memberShipLevel ===
                                                        'PLATINUM'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : c.memberShipLevel ===
                                                              'GOLD'
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {c.memberShipLevel}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-gray-900">
                                                <i className="fa-solid fa-star text-amber-500 mr-2"></i>
                                                {(
                                                    c.loyaltyPoints ?? 0
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition duration-200">
                                                    <button className="p-2.5 text-amber-600 hover:bg-amber-100 rounded-lg transition hover:scale-110">
                                                        <i className="fa-solid fa-eye text-lg"></i>
                                                    </button>
                                                    <button className="p-2.5 text-amber-600 hover:bg-amber-100 rounded-lg transition hover:scale-110">
                                                        <i className="fa-solid fa-pen text-lg"></i>
                                                    </button>
                                                    <button className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition hover:scale-110">
                                                        <i className="fa-solid fa-trash text-lg"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-6 border-t-2 border-gray-200 bg-gradient-to-r from-[#FDFBF8] to-white text-xs text-gray-700 font-medium flex justify-between">
                            <span>
                                Hiển thị {filtered.length} / {customers.length}{' '}
                                khách hàng
                            </span>
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
}
