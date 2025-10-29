import React, { useEffect, useState } from 'react';
import type { Service } from '../../services/serviceService';
import { getAll } from '../../services/serviceService';
import AddServiceModal from '../../components/service/AddServiceModal';
import EditServiceModal from '../../components/service/EditServiceModal';

const ServiceManagement: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(
        null,
    );
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Load danh sách dịch vụ
    useEffect(() => {
        fetchServices();
    }, []);

    // Lọc dịch vụ
    useEffect(() => {
        let filtered = services;

        // Lọc theo danh mục
        if (categoryFilter !== 'ALL') {
            filtered = filtered.filter(
                (s) => s.serviceCategory === categoryFilter,
            );
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            filtered = filtered.filter((s) =>
                s.serviceName.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        setFilteredServices(filtered);
        setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
    }, [services, categoryFilter, searchTerm]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await getAll();
            setServices(data);
            setFilteredServices(data);
        } catch (err) {
            setError('Không thể tải danh sách dịch vụ');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSuccess = (newService: Service) => {
        setServices([...services, newService]);
    };

    const handleEditClick = (service: Service) => {
        setSelectedService(service);
        setShowEditModal(true);
    };

    const handleEditSuccess = (updatedService: Service) => {
        setServices(
            services.map((s) =>
                s.serviceID === updatedService.serviceID ? updatedService : s,
            ),
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            LAUNDRY: 'Giặt là',
            FOOD_BEVERAGE: 'Đồ ăn & Thức uống',
            SPA: 'Spa',
            TRANSPORT: 'Vận chuyển',
            TOUR: 'Tour du lịch',
            OTHER: 'Khác',
        };
        return labels[category] || category;
    };

    // Tính toán phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredServices.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-gray-600">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Quản Lý Dịch Vụ
                </h1>
                <p className="text-gray-600">
                    Thêm mới và cập nhật thông tin dịch vụ khách sạn
                </p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setCategoryFilter('ALL')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                categoryFilter === 'ALL'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setCategoryFilter('LAUNDRY')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                categoryFilter === 'LAUNDRY'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Giặt là
                        </button>
                        <button
                            onClick={() => setCategoryFilter('FOOD_BEVERAGE')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                categoryFilter === 'FOOD_BEVERAGE'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Đồ ăn & Thức uống
                        </button>
                        <button
                            onClick={() => setCategoryFilter('SPA')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                categoryFilter === 'SPA'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Spa
                        </button>
                        <button
                            onClick={() => setCategoryFilter('TRANSPORT')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                categoryFilter === 'TRANSPORT'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Vận chuyển
                        </button>
                        <button
                            onClick={() => setCategoryFilter('TOUR')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                categoryFilter === 'TOUR'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Tour du lịch
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm dịch vụ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                        >
                            <i className="fa-solid fa-plus"></i>
                            Thêm Dịch Vụ
                        </button>
                    </div>
                </div>
            </div>

            {/* Service Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã DV
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên Dịch Vụ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Danh Mục
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giờ Hoạt Động
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng Thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành Động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredServices.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    Không tìm thấy dịch vụ nào
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((service) => (
                                <tr
                                    key={service.serviceID}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {service.serviceID}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {service.serviceName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {getCategoryLabel(
                                            service.serviceCategory,
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                                        {formatPrice(service.price)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {service.serviceHours || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {service.availability ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                Khả dụng
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                Không khả dụng
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() =>
                                                handleEditClick(service)
                                            }
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            <i className="fa-solid fa-edit mr-1"></i>
                                            Sửa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredServices.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                            Hiển thị{' '}
                            <span className="font-bold text-gray-900">
                                {indexOfFirstItem + 1}
                            </span>{' '}
                            -{' '}
                            <span className="font-bold text-gray-900">
                                {Math.min(
                                    indexOfLastItem,
                                    filteredServices.length,
                                )}
                            </span>{' '}
                            / {filteredServices.length} dịch vụ
                        </span>

                        {/* Phân trang */}
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition border-2 text-lg ${
                                        currentPage === 1
                                            ? 'bg-white border-gray-300 text-gray-400 cursor-not-allowed'
                                            : 'bg-white border-white text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    ‹
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition border-2 ${
                                            currentPage === page
                                                ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                                : 'bg-white text-gray-900 border-white hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition border-2 text-lg ${
                                        currentPage === totalPages
                                            ? 'bg-white border-gray-300 text-gray-400 cursor-not-allowed'
                                            : 'bg-white border-white text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            {showAddModal && (
                <AddServiceModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleAddSuccess}
                />
            )}

            {showEditModal && selectedService && (
                <EditServiceModal
                    service={selectedService}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};

export default ServiceManagement;
