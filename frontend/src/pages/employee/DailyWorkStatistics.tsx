import { useState, useEffect } from 'react';
import {
    Wrench,
    Clock,
    CheckCircle2,
    ClipboardList,
    BookOpenCheck,
    Search,
    Calendar,
} from 'lucide-react';
// import type { Task } from '../../types/Task';
export interface Task {
    id: string;
    name: string;
    type: string;
    time: string;
    status: string;
}

export default function DailyWorkStatistics() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setTasks([
            {
                id: 'BK20251109-01',
                name: 'Xác nhận check-in sớm - phòng 302',
                type: 'Check-in sớm',
                time: '07:45 AM',
                status: 'Hoàn tất',
            },
            {
                id: 'BK20251109-02',
                name: 'Khách đến sớm - phòng 405',
                type: 'Check-in sớm',
                time: '08:10 AM',
                status: 'Hoàn tất',
            },
            {
                id: 'BK20251109-03',
                name: 'Sửa máy lạnh phòng 203',
                type: 'Bảo trì',
                time: '09:30 AM',
                status: 'Hoàn tất',
            },
            {
                id: 'BK20251109-04',
                name: 'Kiểm tra điện tầng 2',
                type: 'Bảo trì',
                time: '10:45 AM',
                status: 'Chờ xác nhận',
            },
            {
                id: 'BK20251109-05',
                name: 'Tạo booking cho khách Nguyễn Văn A',
                type: 'Booking',
                time: '11:30 AM',
                status: 'Hoàn tất',
            },
            {
                id: 'BK20251109-06',
                name: 'Tạo booking cho khách Lê Thị Mai',
                type: 'Booking',
                time: '02:15 PM',
                status: 'Đang xử lý',
            },
        ]);
    }, [date]);

    const filtered = tasks.filter(
        (t) =>
            t.id.toLowerCase().includes(search.toLowerCase()) ||
            t.name.toLowerCase().includes(search.toLowerCase()),
    );

    const stats = [
        {
            label: 'Tổng công việc',
            value: tasks.length,
            icon: ClipboardList,
            bg: 'bg-slate-700',
        },
        {
            label: 'Hoàn tất',
            value: tasks.filter((t) => t.status === 'Hoàn tất').length,
            icon: CheckCircle2,
            bg: 'bg-slate-600',
        },
        {
            label: 'Check-in sớm',
            value: tasks.filter((t) => t.type === 'Check-in sớm').length,
            icon: Clock,
            bg: 'bg-slate-500',
        },
        {
            label: 'Bảo trì',
            value: tasks.filter((t) => t.type === 'Bảo trì').length,
            icon: Wrench,
            bg: 'bg-orange-500',
        },
        {
            label: 'Booking',
            value: tasks.filter((t) => t.type === 'Booking').length,
            icon: BookOpenCheck,
            bg: 'bg-amber-500',
        },
    ];

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">
                                Thống kê công việc hằng ngày
                            </h1>
                            <p className="text-sm text-slate-600">
                                Quản lý và theo dõi tiến độ công việc một cách
                                hiệu quả
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-200">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="text-sm font-medium text-slate-700 focus:outline-none bg-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        {s.label}
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900">
                                        {s.value}
                                    </p>
                                </div>
                                <div
                                    className={`${s.bg} p-3 rounded-lg shadow-sm`}
                                >
                                    <s.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã booking hoặc tên công việc..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Booking ID
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Tên công việc
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Loại
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Thời gian
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Trạng thái
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                                    <ClipboardList className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-500">
                                                    Không tìm thấy công việc nào
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((t) => (
                                        <tr
                                            key={t.id}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                                                    {t.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-900">
                                                    {t.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
                                                        t.type ===
                                                        'Check-in sớm'
                                                            ? 'bg-slate-100 text-slate-700'
                                                            : t.type ===
                                                              'Bảo trì'
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                    }`}
                                                >
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-600">
                                                        {t.time}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                                                        t.status === 'Hoàn tất'
                                                            ? 'bg-slate-100 text-slate-700'
                                                            : t.status ===
                                                              'Đang xử lý'
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-orange-100 text-orange-700'
                                                    }`}
                                                >
                                                    {t.status ===
                                                        'Hoàn tất' && (
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                    )}
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        Hiển thị{' '}
                        <span className="font-semibold text-slate-700">
                            {filtered.length}
                        </span>{' '}
                        /{' '}
                        <span className="font-semibold text-slate-700">
                            {tasks.length}
                        </span>{' '}
                        công việc
                    </p>
                </div>
            </div>
        </div>
    );
}
