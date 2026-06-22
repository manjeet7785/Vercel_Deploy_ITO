import React from 'react';
import { FiAward, FiGlobe, FiHeart, FiTarget } from 'react-icons/fi';

export default function About() {
  const values = [
    { icon: FiAward, title: 'Excellence', description: 'We strive for excellence in everything we do' },
    { icon: FiGlobe, title: 'Global Reach', description: 'Connecting markets across continents' },
    { icon: FiHeart, title: 'Integrity', description: 'Honest and transparent business practices' },
    { icon: FiTarget, title: 'Innovation', description: 'Continuous improvement and innovation' }
  ];

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About India Trade Overseas</h1>
          <p className="text-xl max-w-3xl mx-auto text-primary-100">
            Empowering commerce across borders since 2026
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                Having established a robust trade infrastructure across India, India Trade Overseas
                is expanding its horizons globally. Our mission is to facilitate seamless international
                trade by providing premium quality products, secure supply chain logistics, and
                exceptional customer service, bridging the gap between domestic production and the worldwide market.
              </p>
            </div>
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To transform our deep-rooted domestic trading expertise into a globally recognized
                import-export powerhouse. We envision an interconnected world where trade barriers are
                minimized, allowing sustainable, cross-continental businesses to thrive through trust and collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="text-gray-600 mt-4">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center">
                <div className="inline-flex p-3 bg-primary-100 rounded-full mb-4">
                  <value.icon className="text-primary-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
          </div>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className="bg-primary-600 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">2026</div>
                </div>
              </div>
              <div className="md:w-3/4 card">
                <h3 className="text-xl font-semibold mb-2">The Foundation & Global Pivot</h3>
                <p className="text-gray-600">
                  India Trade Overseas officially lays its foundation. Transitioning from strong domestic
                  trading roots within India, we scaled up operations to take Indian enterprise to the global stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Leadership Team</h2>
            <p className="text-gray-600 mt-4">Meet the minds driving our global vision</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" alt="Founder" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold">Md Ramiz Raza Khan</h3>
              <p className="text-primary-600 mb-3 font-medium">Founder</p>
              <p className="text-gray-600 text-sm italic border-t border-gray-100 pt-3">
                "Building systems today that will run the business empire of tomorrow."
              </p>
            </div>
            <div className="card text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" alt="Co-Founder" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold">Sonia Singh</h3>
              <p className="text-primary-600 mb-3 font-medium">Co-Founder</p>
              <p className="text-gray-600 text-sm italic border-t border-gray-100 pt-3">
                "Cultivating networks today that will secure our global footprint tomorrow."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}