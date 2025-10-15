import React, { FC } from 'react';
import ServiceButton from '../../components/ServiceButton';

const Home: FC = () => {
    return (
        <div className="bg-white antialiased font-sans">
            {/* Hero Video Section */}
            <section className="relative w-full h-screen overflow-hidden">
                <video
                    src="https://res.cloudinary.com/dyccrebqj/video/upload/v1758708870/0924_te7gqq.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                {/* optional overlay or hero content can be added here */}
            </section>

            {/* Tagline Section */}
            <section
                id="discover"
                className="py-24 bg-gradient-to-b from-white to-gray-50"
            >
                <div className="max-w-5xl mx-auto text-center px-6">
                    <h2 className="text-3xl md:text-4xl lg:text-4xl font-serif text-gray-800 mb-6 leading-relaxed">
                        The Art of Luxury, The Science of Service
                    </h2>
                    <div className="h-0.5 w-32 mx-auto mb-8 bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />
                    <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto">
                        Experience unparalleled hospitality where every detail
                        is crafted to perfection, and every moment becomes an
                        everlasting memory.
                    </p>
                </div>
            </section>

            {/* Three Features Grid */}
            <section className="px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Landscape Card */}
                    <div className="group relative overflow-hidden rounded-lg shadow-2xl cursor-pointer h-[550px] transition-transform duration-700 hover:scale-105">
                        <img
                            src="https://res.cloudinary.com/dk8gvar3y/image/upload/v1759815555/snapedit_1759815339900_appzzr.jpg"
                            alt="Luxury Yacht Landscape"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-4xl font-serif font-semibold mb-4 tracking-wide">
                                Landscape
                            </h3>
                            <div className="h-0.5 w-20 mb-4 bg-gradient-to-r from-luxury-gold to-transparent" />
                            <p className="text-base font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                Where all limits fade, leaving only the beauty
                                of creation and the generosity of the human
                                spirit
                            </p>
                        </div>
                    </div>

                    {/* Architecture Card */}
                    <div className="group relative overflow-hidden rounded-lg shadow-2xl cursor-pointer h-[550px] transition-transform duration-700 hover:scale-105">
                        <img
                            src="https://res.cloudinary.com/dk8gvar3y/image/upload/v1759815555/snapedit_1759815323646_jjezbb.jpg"
                            alt="Grand Architecture"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-4xl font-serif font-semibold mb-4 tracking-wide">
                                Architecture
                            </h3>
                            <div className="h-0.5 w-20 mb-4 bg-gradient-to-r from-luxury-gold to-transparent" />
                            <p className="text-base font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                A Manifesto of Pride and Creativity Reaching for
                                the Endless Blue Ocean Horizon
                            </p>
                        </div>
                    </div>

                    {/* Amenity Card */}
                    <div className="group relative overflow-hidden rounded-lg shadow-2xl cursor-pointer h-[550px] transition-transform duration-700 hover:scale-105">
                        <img
                            src="https://res.cloudinary.com/dk8gvar3y/image/upload/v1759815555/snapedit_1759815210477_hyr5me.jpg"
                            alt="Underwater Dining"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-4xl font-serif font-semibold mb-4 tracking-wide">
                                Amenity
                            </h3>
                            <div className="h-0.5 w-20 mb-4 bg-gradient-to-r from-luxury-gold to-transparent" />
                            <p className="text-base font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                Embracing the ocean, losing yourself in the
                                water, and living in the moment
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Retreat Banner */}
            <section className="relative w-full h-screen overflow-hidden mt-20">
                <img
                    src="https://res.cloudinary.com/dk8gvar3y/image/upload/v1760002659/snapedit_1760002631640_fkoka9.jpg"
                    alt="Retreat Experience"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-6">
                    <h2 className="text-4xl md:text-4xl lg:text-5xl font-serif font-light mb-6 tracking-wider drop-shadow-[2px_4px_12px_rgba(0,0,0,0.4)]">
                        Retreat
                    </h2>
                    <div className="h-0.5 w-24 mb-8 bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />
                    <p className="text-lg md:text-lg font-light mb-12 max-w-lg leading-relaxed drop-shadow-[2px_4px_12px_rgba(0,0,0,0.4)]">
                        Emotions are soothed, and the soul rests and rejuvenates
                    </p>
                    <ServiceButton
                        text="EXPLORE SERVICES"
                        href="/productPage"
                    />
                </div>
            </section>

            {/* Vista Membership Section */}
            <section className="bg-gradient-to-br from-gray-50 to-white py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div>
                                <p className="text-luxury-gold text-sm tracking-widest mb-4 uppercase font-medium">
                                    Exclusive Benefits
                                </p>
                                <h2 className="text-4xl md:text-3xl lg:text-4xl font-serif text-gray-900 mb-6 leading-tight">
                                    Vista Membership
                                </h2>
                                <div className="h-0.5 w-24 mb-8 bg-gradient-to-r from-luxury-gold to-transparent" />
                            </div>

                            <p className="text-gray-600 text-sm md:text-lg leading-relaxed max-w-lg">
                                Exclusive service designed just for you, at a
                                special price. Experience privileges beyond
                                imagination.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <svg
                                        className="w-6 h-6 text-luxury-gold flex-shrink-0 mt-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-gray-700 text-sm">
                                        Priority reservations and complimentary
                                        upgrades
                                    </span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <svg
                                        className="w-6 h-6 text-luxury-gold flex-shrink-0 mt-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-gray-700 text-sm">
                                        Access to exclusive facilities and
                                        events
                                    </span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <svg
                                        className="w-6 h-6 text-luxury-gold flex-shrink-0 mt-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-gray-700 text-sm">
                                        Personalized concierge services 24/7
                                    </span>
                                </div>
                            </div>

                            <ServiceButton text="JOIN NOW" href="/join" />
                        </div>

                        {/* Right Image */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark rounded-lg opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
                            <img
                                src="https://res.cloudinary.com/dk8gvar3y/image/upload/v1759820893/BetterImage_1759820879438_apb0pb.jpg"
                                alt="Vista Membership Experience"
                                className="relative w-full h-[600px] object-cover rounded-lg shadow-2xl transition-all duration-500 group-hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
