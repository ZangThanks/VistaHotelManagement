import React from 'react';
import ServiceCard, { type Service } from '../../components/ServiceCard';

interface ServiceListProps {
    laundryServices?: Service[];
    foodServices?: Service[];
}

const ServiceList: React.FC<ServiceListProps> = ({
    laundryServices = [],
    foodServices = [],
}) => {
    return (
        <div className="font-sans">
            {/* Hero Banner with fixed background */}
            <div
                className="relative h-[80vh] bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage:
                        "url('https://res.cloudinary.com/dk8gvar3y/image/upload/v1760002659/snapedit_1760002631640_fkoka9.jpg')",
                }}
            />

            {/* Main Content Container with overlapping banner */}
            <div className="w-[95%] mx-auto bg-gradient-to-b from-[#F8EBD6] to-white -mt-20 relative z-10 rounded-t-3xl shadow-xl">
                {/* Statistics Section */}
                <div className="py-16">
                    <div className="max-w-6xl mx-auto px-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-300">
                            <div className="text-center px-8">
                                <h3 className="text-5xl font-bold text-blue-500 mb-3">
                                    50+
                                </h3>
                                <p className="text-xl font-bold text-gray-900 mb-3">
                                    Services
                                </p>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    A dedication to unique flavors and heartfelt
                                    service, celebrating your palate
                                </p>
                            </div>

                            <div className="text-center px-8">
                                <h3 className="text-5xl font-bold text-blue-500 mb-3">
                                    120+
                                </h3>
                                <p className="text-xl font-bold text-gray-900 mb-3">
                                    Dish
                                </p>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    A dedication to unique flavors and heartfelt
                                    service, celebrating your palate
                                </p>
                            </div>

                            <div className="text-center px-8">
                                <h3 className="text-5xl font-bold text-blue-500 mb-3">
                                    5+
                                </h3>
                                <p className="text-xl font-bold text-gray-900 mb-3">
                                    Stars
                                </p>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    A dedication to unique flavors and heartfelt
                                    service, celebrating your palate
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service List Section */}
                <div className="max-w-7xl mx-auto py-16 bg-transparent">
                    {/* Laundry Services */}
                    <section className="mb-16">
                        <div className="flex gap-10">
                            <div className="w-64 flex-shrink-0">
                                <h3 className="text-2xl font-bold mb-4">
                                    Laundry
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    We offer professional laundry services,
                                    including washing, drying, and folding, to
                                    make your life easier.
                                </p>
                            </div>

                            <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {laundryServices.map((s) => (
                                        <ServiceCard
                                            key={s.id ?? s.name}
                                            service={s}
                                        />
                                    ))}
                                </div>
                                <div className="text-right mt-6">
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:underline text-sm font-medium"
                                    >
                                        Read more
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Food and Beverage Services */}
                    <section className="mb-16">
                        <div className="flex gap-8">
                            <div className="w-64 flex-shrink-0">
                                <h3 className="text-2xl font-bold mb-4">
                                    Food and Beverage
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    To awaken every sense, to elevate with
                                    exquisite flavors. Crafted with passion and
                                    mastery, indulge in our sumptuous coffees.
                                </p>
                            </div>

                            <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {foodServices.map((s) => (
                                        <ServiceCard
                                            key={s.id ?? s.name}
                                            service={s}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer: integrate your existing footer component where needed */}
        </div>
    );
};

export default ServiceList;
