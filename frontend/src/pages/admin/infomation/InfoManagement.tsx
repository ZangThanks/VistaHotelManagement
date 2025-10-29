/* eslint-disable*/
import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaTag,
  FaCalendarAlt,
  FaEye,
  FaTrashAlt,
  FaEdit,
  FaEyeSlash,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import PageHeader from "../../../components/info_management/PageHeader";
import StatCard from "../../../components/info_management/StatCard";
import InfoCard from "../../../components/info_management/InfoCard";
import { Dialog } from "../../../components/info_management/Dialog";
import AddInfoForm from "../../../components/info_management/AddInfoForm";

interface InfoItem {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft" | "archived";
  preview: string;
  image: string;
  updatedDate: string;
  views: number;
}

const InfoManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("lastUpdated");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock data
  const infoItems: InfoItem[] = [
    {
      id: "1",
      title: "About Vista Hotel",
      category: "About Us",
      status: "published",
      preview:
        "Vista Hotel is a luxury 5-star establishment located in the heart of the city, offering exceptional service and accommodation...",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      updatedDate: "05 Jun 2023",
      views: 1245,
    },
    {
      id: "2",
      title: "Swimming Pool & Spa",
      category: "Facilities",
      status: "published",
      preview:
        "Enjoy our world-class swimming pool and spa facilities, featuring an infinity pool overlooking the city skyline...",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      updatedDate: "12 Jun 2023",
      views: 958,
    },
    {
      id: "3",
      title: "Fine Dining Experience",
      category: "Services",
      status: "published",
      preview:
        "Our award-winning restaurant offers a sophisticated fine dining experience with a menu crafted by Michelin-starred chefs...",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      updatedDate: "18 Jun 2023",
      views: 875,
    },
    {
      id: "4",
      title: "Conference Facilities",
      category: "Facilities",
      status: "draft",
      preview:
        "Host your next business meeting or conference in our state-of-the-art facilities equipped with the latest technology...",
      image:
        "https://images.unsplash.com/photo-1574691250077-03a929faece5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      updatedDate: "25 Jun 2023",
      views: 430,
    },
    {
      id: "5",
      title: "Hotel History",
      category: "History",
      status: "archived",
      preview:
        "Established in 1975, Vista Hotel has a rich history of providing exceptional luxury accommodation for over 45 years...",
      image:
        "https://images.unsplash.com/photo-1519690889869-e705e59f72e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      updatedDate: "03 May 2023",
      views: 612,
    },
    {
      id: "6",
      title: "Awards & Recognition",
      category: "Awards",
      status: "published",
      preview:
        "Vista Hotel has received numerous awards for excellence in hospitality, including the prestigious Five Diamond Award...",
      image:
        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      updatedDate: "22 Jun 2023",
      views: 745,
    },
  ];

  const filteredItems = infoItems
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.preview.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "oldest":
          return (
            new Date(a.updatedDate).getTime() -
            new Date(b.updatedDate).getTime()
          );
        case "views":
          return b.views - a.views;
        default:
          return (
            new Date(b.updatedDate).getTime() -
            new Date(a.updatedDate).getTime()
          );
      }
    });

  const handleDeleteItem = (id: string) => {
    console.log(`Delete item with id ${id}`);
  };

  const handleEditItem = (id: string) => {
    console.log(`Edit item with id ${id}`);
  };

  const handleViewItem = (id: string) => {
    console.log(`View item with id ${id}`);
  };

  return (
    <div className="p-6 space-y-8">
      <PageHeader
        title="Hotel Information Management"
        buttonText="Add New Information"
        buttonIcon={<FaPlus />}
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaTag className="text-gold" />}
          iconBgColor="bg-gold/10"
          value="12"
          label="Information Pages"
        />
        <StatCard
          icon={<FaEye className="text-blue-500" />}
          iconBgColor="bg-blue-500/10"
          value="48"
          label="Images"
        />
        <StatCard
          icon={<FaCalendarAlt className="text-green-600" />}
          iconBgColor="bg-green-600/10"
          value="5,280"
          label="Monthly Views"
        />
        <StatCard
          icon={<FaEyeSlash className="text-pink-500" />}
          iconBgColor="bg-pink-500/10"
          value="15 days"
          label="Last Updated"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search information..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-44">
              <label className="block text-sm text-gray-500 mb-1">
                Category:
              </label>
              <select
                className="w-full p-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="About Us">About Us</option>
                <option value="Facilities">Facilities</option>
                <option value="Services">Services</option>
                <option value="History">History</option>
                <option value="Awards">Awards</option>
              </select>
            </div>

            <div className="w-full md:w-44">
              <label className="block text-sm text-gray-500 mb-1">
                Status:
              </label>
              <select
                className="w-full p-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="w-full md:w-44">
              <label className="block text-sm text-gray-500 mb-1">
                Sort By:
              </label>
              <select
                className="w-full p-2.5 rounded-lg border border-cream focus:border-gold focus:ring focus:ring-gold/20 outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="lastUpdated">Last Updated</option>
                <option value="title">Title (A-Z)</option>
                <option value="oldest">Oldest First</option>
                <option value="views">Most Views</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition w-full md:w-auto">
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <InfoCard
            key={item.id}
            item={item}
            onDelete={() => handleDeleteItem(item.id)}
            onEdit={() => handleEditItem(item.id)}
            onView={() => handleViewItem(item.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {filteredItems.length > 0 ? (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded flex items-center justify-center border border-cream hover:bg-cream transition">
              <FaAngleLeft />
            </button>
            <button className="w-9 h-9 rounded flex items-center justify-center bg-gold text-white">
              1
            </button>
            <button className="w-9 h-9 rounded flex items-center justify-center border border-cream hover:bg-cream transition">
              2
            </button>
            <button className="w-9 h-9 rounded flex items-center justify-center border border-cream hover:bg-cream transition">
              <FaAngleRight />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-light/50 rounded-lg">
          <h3 className="text-xl font-playfair mb-2">No information found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add New Information Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <AddInfoForm onClose={() => setIsAddModalOpen(false)} />
      </Dialog>
    </div>
  );
};

export default InfoManagement;
