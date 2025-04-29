import Banner from '../assets/img/Banner.jpeg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import React, { useRef, useEffect } from 'react';


export default function Home() {
  const scrollRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 300,
    });
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'right' ? 340 : -340,
        behavior: 'smooth',
      });
    }
  };

  const services = [
    { title: 'Head Spa', img: Banner },
    { title: 'Body Massage', img: Banner },
    { title: 'Reception', img: Banner },
    { title: 'Hair Salon', img: Banner },
  ];

  return (
    <main className="text-center py-10 px-4 sm:px-6 md:px-10 lg:px-20 font-montserrat">
      {/* Tiêu đề */}
      <h1
        className="text-3xl sm:text-4xl md:text-5xl text-green-900 font-semibold"
        data-aos="fade-up"
        data-aos-delay="0"
      >
        Boutique Spa & Hair Salon
      </h1>

      {/* Hình ảnh banner */}
      <div
        className="flex justify-center mt-10"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <img
          src={Banner}
          alt="Spa Room"
          className="rounded-lg w-full max-w-screen-2xl h-auto max-h-[600px] object-cover"
        />
      </div>

      {/* Mô tả */}
      <div
        className="max-w-4xl mx-auto mt-10 text-base md:text-xl leading-relaxed text-gray-700"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <p className="text-justify indent-8">
          An's Spa – where every visit is a chance to reconnect with yourself. Our serene
          environment and tailored treatments offer you a peaceful escape, helping you recharge and
          find harmony. At An's Spa, we believe that true relaxation is not a luxury but a path to
          well-being. Embark on a journey of self-love by visiting us today.
        </p>
      </div>

      {/* Phần dịch vụ spa */}
      <section
        className="mt-64 relative font-montserrat"
        data-aos="fade-up"
        data-aos-offset="500"
        data-aos-delay="200"
        data-aos-once="true"
      >
        {/* Nút trái */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-green-800 text-white w-10 h-10 flex items-center justify-center rounded-full shadow"
        >
          &#8592;
        </button>

        {/* Scroll gallery */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scroll-smooth whitespace-nowrap px-6"
        >
          <div className="flex gap-6">
            {services.map((item, index) => (
              <div
                key={index}
                className="w-[800px] flex-shrink-0"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-[600px] object-cover rounded-md shadow-lg"
                />
                <div className="mt-3 text-center">
                  <p className="text-lg">{item.title}</p>
                  <div className="w-full h-[1px] bg-green-800 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nút phải */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-green-800 text-white w-10 h-10 flex items-center justify-center rounded-full shadow"
        >
          &#8594;
        </button>
      </section>
      <section
        className="max-w-3xl mx-auto mt-28 text-center px-4 font-montserrat"
        data-aos="fade-up"
        data-aos-offset="300"
        data-aos-delay="100"
      >
        {/* Tiêu đề */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-green-900 mb-6">
          Where Minimalism Meets Serenity
        </h2>

        {/* Mô tả đầu */}
        <p className="text-gray-700 mb-6 leading-relaxed">
          Transparency is our love language. We are committed to delivering excellence and quality service,
          using only trusted products from Oway, Gernetic, and Le Fin Du Fin. Explore our menu to discover
          more about our carefully curated treatments designed for your well-being.
        </p>

        {/* Link Menu */}
        <div className="space-y-3 mb-6">
          <a href="#" className="text-green-900 underline text-lg block">Head Spa & Scalp Treatment Menu</a>
          <a href="#" className="text-green-900 underline text-lg block">Body Massage & Treatment Menu</a>
          <a href="#" className="text-green-900 underline text-lg block">Lifestyle Package</a>
        </div>

        {/* Mô tả cuối */}
        <p className="text-gray-700 mb-6 leading-relaxed">
          An's Spa believes that the path to relaxation is as unique as you are. Dive into a world of
          personalized wellness with our exclusive packages, each offering a tailored experience that aligns
          with your lifestyle and provides a harmonious balance of rejuvenation and tranquillity.
        </p>

        {/* Link FAQ */}
        <a href="#" className="text-green-900 underline text-lg">FAQ</a>
      </section>
    </main>
  );
}
