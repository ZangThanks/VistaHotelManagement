import React, { useEffect, useState, useRef } from 'react';
import HeaderHome from '../../components/HeaderHome';
import Header from '../../components/Header';
import bannerImg from '../../assets/images/bg_newPage.png'; // ✅ Import ảnh chuẩn

const NewsPage: React.FC = () => {
    const [showSolidHeader, setShowSolidHeader] = useState(false);
    const bannerRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!bannerRef.current) return;

            const bannerHeight = bannerRef.current.clientHeight;
            const triggerPoint = bannerHeight * 0.6; // 60% chiều cao banner

            if (window.scrollY > triggerPoint) {
                setShowSolidHeader(true);
            } else {
                setShowSolidHeader(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-white text-slate-800 font-sans">
            <div className="fixed top-0 left-0 w-full z-[9999] transition-all duration-700 ease-in-out">
                {/* Header trong suốt ban đầu */}
                <div
                    className={`transition-opacity duration-700 ${
                        showSolidHeader
                            ? 'opacity-0 pointer-events-none'
                            : 'opacity-100'
                    }`}
                >
                    <HeaderHome />
                </div>

                {/* Header solid màu sau khi scroll */}
                <div
                    className={`absolute top-0 left-0 w-full transition-opacity duration-700 ${
                        showSolidHeader
                            ? 'opacity-100'
                            : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <Header />
                </div>
            </div>

            {/* 🔳 Banner */}
            <img
                ref={bannerRef}
                src={bannerImg}
                alt="News Banner"
                className="w-full h-screen object-cover"
            />
            <main>
                {/* PHẦN NỔI BẬT */}
                <section className="mx-auto max-w-3xl px-4 mt-10">
                    <div className="flex justify-center">
                        <span className="text-[20px] font-serif tracking-[.25em] uppercase">
                            Nổi bật
                        </span>
                    </div>

                    <article className="mt-6 overflow-hidden rounded-lg shadow-lg bg-white">
                        <div className="aspect-[21/9]">
                            <img
                                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000&auto=format&fit=crop"
                                alt="Concert"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-5 md:p-6">
                            <p className="text-[11px] uppercase tracking-widest text-slate-400">
                                Sự kiện
                            </p>
                            <h2 className="mt-1 font-serif text-xl md:text-2xl text-slate-800">
                                Concert Anh Trai Say Hi đã trở lại 30/09
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Đêm nhạc bùng nổ với dàn khách mời đình đám, hệ
                                thống âm thanh ánh sáng cao cấp và không gian
                                sang trọng của Vista.
                            </p>
                            <div className="mt-4">
                                <a
                                    href="#"
                                    className="text-[12px] uppercase tracking-widest text-slate-700 hover:text-black inline-flex items-center gap-2 transition-colors"
                                >
                                    Chi tiết
                                    <span className="inline-block h-px w-6 bg-slate-400" />
                                </a>
                            </div>
                        </div>
                    </article>
                </section>

                {/* 📌 PHẦN BÀI VIẾT KHÁC */}
                <section className="mx-auto max-w-5xl px-4 mt-14">
                    <div className="flex justify-center">
                        <span className="text-[20px] font-serif tracking-[.25em] uppercase">
                            Khác
                        </span>
                    </div>

                    {/* Bài 1 */}
                    <article className="mt-6 grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="https://nld.mediacdn.vn/291774122806476800/2022/6/24/52168347964886b9fb120k-16560429032311044128067.jpg"
                                alt="Ẩm thực"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-serif text-lg md:text-xl">
                                Food Festival 15/10
                            </h3>
                            <p className="mt-2 mb-3 text-sm leading-7 text-slate-600">
                                Hội chợ ẩm thực địa phương với hơn 30 gian hàng,
                                lớp học nấu ăn và trình diễn nhạc acoustic.
                            </p>
                            <a
                                href="#"
                                className="text-xs tracking-wide uppercase px-4 py-1 rounded-full border border-black hover:text-white hover:bg-black transition-colors"
                            >
                                Chi tiết
                            </a>
                        </div>
                    </article>

                    {/* Bài 2 */}
                    <article className="mt-10 grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                        <div className="md:order-2 aspect-[3/2] rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop"
                                alt="Khách sạn"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:order-1">
                            <h3 className="font-serif text-lg md:text-xl">
                                Vista International Hotel
                            </h3>
                            <p className="mt-2 mb-3 text-sm leading-7 text-slate-600">
                                Trải nghiệm nghỉ dưỡng phong cách Địa Trung Hải
                                với view biển tuyệt đẹp.
                            </p>
                            <a
                                href="#"
                                className="text-xs tracking-wide uppercase px-4 py-1 rounded-full border border-black hover:text-white hover:bg-black transition-colors"
                            >
                                Chi tiết
                            </a>
                        </div>
                    </article>

                    {/* Xem Thêm */}
                    <div className="my-10 flex justify-center">
                        <button className="text-sm uppercase tracking-widest px-5 py-2 rounded-full border border-black hover:text-white hover:bg-black transition-colors">
                            Xem thêm
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default NewsPage;
