/*eslint-disable*/
import type React from 'react';
import { useEffect, useState } from 'react';
import type { Employee } from '../../types/Employee';
import { getAll, deleteEmployee } from '../../services/employeeService';
import AddEmployeeModal from '../../components/employee/AddEmployeeModal';
import EditEmployeeModal from '../../components/employee/EditEmployeeModal';
import { useToastContext } from '../../hooks/useToastContext';

/* ---------------------------- Stat Card ---------------------------- */
type StatCardProps = {
    icon: string;
    label: string;
    value: React.ReactNode;
    color?: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-lg border border-[#b9ad96]/30 p-4 sm:p-5 hover:shadow-xl hover:border-[#b9ad96] transition-all duration-300 transform hover:scale-105">
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
                <p className="text-[#1e293b]/70 text-xs sm:text-sm font-medium mb-2 truncate">
                    {label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-black truncate">
                    {value}
                </p>
            </div>
            <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white text-base sm:text-lg ${color} shadow-md`}
            >
                <i className={`fa-solid ${icon}`}></i>
            </div>
        </div>
    </div>
);

// EMPLOYEE LIST PAGE

export default function EmployeeList() {
    const toast = useToastContext();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null,
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleEditEmployee = (emp: Employee) => {
        console.log('Opening edit modal for employee:', emp);
        if (!emp.id) {
            console.error('Employee missing ID:', emp);
            toast.error('Nhân viên không có ID hợp lệ');
            return;
        }
        setSelectedEmployee(emp);
        setShowEditModal(true);
    };

    const handleDeleteEmployee = async (employeeId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return;

        try {
            await deleteEmployee(employeeId);
            setEmployees((prev) => prev.filter((e) => e.id !== employeeId));
        } catch (error) {
            console.error('Delete employee error:', error);
            toast.error('Không thể xóa nhân viên');
        }
    };

    /* ------------------------- LOAD EMPLOYEES ------------------------- */
    const loadEmployees = async () => {
        try {
            const data = await getAll();
            setEmployees(data ?? []);
        } catch (error) {
            console.error('Load employees error:', error);
            toast.error('Không thể tải danh sách nhân viên');
        }
    };

    /* ------------------------- FETCH DATA ------------------------- */
    useEffect(() => {
        const load = async () => {
            try {
                await loadEmployees();
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    /* ------------------------- FILTER + SEARCH ------------------------- */
    const filtered = employees.filter((e) => {
        const key =
            (e.fullName ?? '') +
            (e.email ?? '') +
            (e.id ?? '') +
            (e.department ?? '');

        return key.toLowerCase().includes(search.toLowerCase());
    });

    /* ------------------------- PAGINATION ------------------------- */
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEmployees = filtered.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    /* ------------------------- LOADING & ERROR ------------------------- */
    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white via-[#f5f2ee] to-[#b9ad96]/20 p-4">
                <div className="text-center">
                    <i className="fa-solid fa-spinner fa-spin text-4xl sm:text-6xl text-[#b9ad96] mb-4"></i>
                    <p className="text-[#1e293b] text-lg sm:text-xl font-semibold">
                        Đang tải dữ liệu nhân viên...
                    </p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white via-[#f5f2ee] to-[#b9ad96]/20 p-4">
                <div className="text-center">
                    <i className="fa-solid fa-triangle-exclamation text-4xl sm:text-6xl text-black mb-4"></i>
                    <p className="text-[#1e293b] text-lg sm:text-xl font-semibold px-4">
                        {error}
                    </p>
                </div>
            </div>
        );

    /* ===================================================================
                                UI RENDER
    =================================================================== */
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#f5f2ee] to-[#b9ad96]/20">
            <div className="pt-4 sm:pt-8 px-3 sm:px-6 pb-6 sm:pb-10">
                <div className="max-w-7xl mx-auto">
                    {/* Title */}
                    <div className="mb-4 sm:mb-8">
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-black mb-2 sm:mb-3 tracking-tight">
                            Quản lý nhân viên
                        </h1>
                        <p className="text-sm sm:text-base text-[#1e293b]">
                            Quản lý dữ liệu nhân viên một cách hiệu quả
                        </p>
                    </div>

                    {/* Thống kê - Responsive Grid */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <StatCard
                            icon="fa-users"
                            label="Tổng nhân viên"
                            value={employees.length}
                            color="bg-black"
                        />
                        <StatCard
                            icon="fa-building"
                            label="Bộ phận"
                            value={
                                [...new Set(employees.map((e) => e.department))]
                                    .length
                            }
                            color="bg-[#1e293b]"
                        />
                        <StatCard
                            icon="fa-id-badge"
                            label="Vị trí công việc"
                            value={
                                [...new Set(employees.map((e) => e.position))]
                                    .length
                            }
                            color="bg-[#b9ad96]"
                        />
                        <StatCard
                            icon="fa-dollar-sign"
                            label="Tổng lương"
                            value={employees
                                .reduce((t, e) => t + (e.salary ?? 0), 0)
                                .toLocaleString()}
                            color="bg-gradient-to-br from-[#b9ad96] to-[#1e293b]"
                        />
                    </div>

                    {/* Tìm kiếm và thao tác */}
                    <div className="bg-white rounded-xl shadow-lg border border-[#b9ad96]/30 p-4 sm:p-6 mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[#b9ad96] text-sm"></i>
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên, email, mã, bộ phận..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-[#b9ad96]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:border-transparent transition bg-[#b9ad96]/5 hover:bg-white text-sm text-black placeholder:text-[#1e293b]/50"
                                />
                            </div>

                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-gradient-to-r from-black to-[#1e293b] hover:from-[#1e293b] hover:to-black text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2 transform hover:scale-105"
                            >
                                <i className="fa-solid fa-plus text-sm"></i>
                                <span className="hidden sm:inline">
                                    Thêm nhân viên
                                </span>
                                <span className="sm:hidden">Thêm</span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop Table và Mobile Cards */}
                    <div className="bg-white rounded-xl shadow-lg border border-[#b9ad96]/30 overflow-hidden">
                        {/* Desktop Table - Hidden on mobile */}
                        <div className="hidden lg:block">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-[#b9ad96]/20 to-[#b9ad96]/30 border-b border-[#b9ad96]">
                                        <tr>
                                            <th className="px-4 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                Nhân viên
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                Bộ phận
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                Vị trí
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                Liên hệ
                                            </th>
                                            <th className="px-4 py-4 text-center text-xs font-bold text-black uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#b9ad96]/30">
                                        {currentEmployees.map((e) => (
                                            <tr
                                                key={e.id}
                                                className="hover:bg-[#b9ad96]/10 transition-colors group"
                                            >
                                                <td className="px-4 py-4 font-bold text-black text-sm">
                                                    #{e.id}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black to-[#1e293b] flex items-center justify-center text-white font-bold text-sm">
                                                            {e.fullName.charAt(
                                                                0,
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-black font-semibold">
                                                                {e.fullName}
                                                            </p>
                                                            <p className="text-xs text-[#1e293b]/60">
                                                                {e.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#b9ad96]/30 text-[#1e293b]">
                                                        {e.department}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span className="text-sm text-black font-medium">
                                                        {e.position}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-black">
                                                            {e.phone}
                                                        </p>
                                                        <p className="text-xs text-[#1e293b]/60">
                                                            {e.address}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button className="p-2 text-[#1e293b] hover:bg-[#b9ad96]/20 rounded-lg transition-colors">
                                                            <i className="fa-solid fa-eye text-sm"></i>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEditEmployee(
                                                                    e,
                                                                )
                                                            }
                                                            className="p-2 text-[#b9ad96] hover:bg-[#b9ad96]/20 rounded-lg transition-colors"
                                                        >
                                                            <i className="fa-solid fa-pen text-sm"></i>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteEmployee(
                                                                    e.id,
                                                                )
                                                            }
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <i className="fa-solid fa-trash text-sm"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards - Visible on mobile */}
                        <div className="lg:hidden divide-y divide-[#b9ad96]/30">
                            {currentEmployees.map((e) => (
                                <div
                                    key={e.id}
                                    className="p-4 hover:bg-[#b9ad96]/10 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black to-[#1e293b] flex items-center justify-center text-white font-bold">
                                                {e.fullName.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-black truncate">
                                                    {e.fullName}
                                                </h3>
                                                <p className="text-xs text-[#1e293b]/60">
                                                    ID: #{e.id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-2">
                                            <button className="p-2 text-[#1e293b] hover:bg-[#b9ad96]/20 rounded-lg transition-colors">
                                                <i className="fa-solid fa-eye text-sm"></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleEditEmployee(e)
                                                }
                                                className="p-2 text-[#b9ad96] hover:bg-[#b9ad96]/20 rounded-lg transition-colors"
                                            >
                                                <i className="fa-solid fa-pen text-sm"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-[#1e293b]/60 block">
                                                Bộ phận:
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#b9ad96]/30 text-[#1e293b] mt-0.5">
                                                {e.department}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[#1e293b]/60 block">
                                                Vị trí:
                                            </span>
                                            <span className="font-medium text-black">
                                                {e.position}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[#1e293b]/60 block">
                                                Email:
                                            </span>
                                            <span className="font-medium text-black break-all">
                                                {e.email}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[#1e293b]/60 block">
                                                Phone:
                                            </span>
                                            <span className="font-medium text-black">
                                                {e.phone}
                                            </span>
                                        </div>
                                        <div className="xs:col-span-2">
                                            <span className="text-[#1e293b]/60 block">
                                                Địa chỉ:
                                            </span>
                                            <span className="font-medium text-black">
                                                {e.address}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer với Pagination */}
                        <div className="px-4 py-4 sm:px-6 border-t border-[#b9ad96]/30 bg-gradient-to-r from-[#b9ad96]/10 to-[#b9ad96]/20">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-black font-medium">
                                    <span className="hidden sm:inline">
                                        Hiển thị {startIndex + 1}–
                                        {Math.min(endIndex, filtered.length)} /{' '}
                                        {filtered.length} nhân viên
                                    </span>
                                    <span className="sm:hidden">
                                        {startIndex + 1}–
                                        {Math.min(endIndex, filtered.length)} /{' '}
                                        {filtered.length}
                                    </span>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2">
                                        {/* Previous Button */}
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

                                        {/* Simple pagination - chỉ hiển thị số trang hiện tại */}
                                        <div className="flex items-center">
                                            <span className="text-gray-700 px-3 py-1">
                                                {currentPage} / {totalPages}
                                            </span>
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        totalPages,
                                                        prev + 1,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
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
            </div>

            {/* FontAwesome */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />

            <AddEmployeeModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    setShowModal(false);
                    loadEmployees();
                }}
            />

            <EditEmployeeModal
                show={showEditModal}
                employee={selectedEmployee}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedEmployee(null);
                }}
                onSuccess={() => {
                    setShowEditModal(false);
                    setSelectedEmployee(null);
                    loadEmployees();
                }}
            />
        </div>
    );
}
