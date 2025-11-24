/* eslint-disable */
import React from 'react';
import {
    FaTag,
    FaCalendarAlt,
    FaEye,
    FaTrashAlt,
    FaEdit,
    FaEyeSlash,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Badge from './Badge';

interface InfoCardProps {
    item: {
        id: string;
        title: string;
        category: string;
        status: 'published' | 'draft' | 'archived';
        preview: string;
        image: string;
        updatedDate: string;
        views: number;
    };
    onDelete: () => void;
    onEdit: () => void;
    onView: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
    item,
    onDelete,
    onEdit,
    onView,
}) => {
    return (
        <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div
                onClick={onView}
                className="h-52 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${item.image})` }}
            >
                <div className="absolute top-4 right-4">
                    <Badge status={item.status} />
                </div>
            </div>

            <div className="p-5 flex flex-col h-[calc(100%-13rem)]">
                <h3 className="font-playfair text-xl mb-2">{item.title}</h3>

                <div className="text-gold text-sm flex items-center mb-3">
                    <FaTag size={12} className="mr-2" />
                    <span>{item.category}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {item.preview}
                </p>

                <div className="flex justify-between text-gray-500 text-xs mb-4">
                    <span className="flex items-center">
                        <FaCalendarAlt className="mr-1" /> Updated:{' '}
                        {item.updatedDate}
                    </span>
                    <span className="flex items-center">
                        <FaEye className="mr-1" /> {item.views.toLocaleString()}{' '}
                        views
                    </span>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onView}
                        className="w-8 h-8 rounded-full bg-light hover:bg-cream flex items-center justify-center transition"
                        title="View"
                    >
                        <FaEye size={14} />
                    </button>
                    <button
                        onClick={onEdit}
                        className="w-8 h-8 rounded-full bg-light hover:bg-cream flex items-center justify-center transition"
                        title="Edit"
                    >
                        <FaEdit size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default InfoCard;
