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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About ITO Exim</h1>
          <p className="text-xl max-w-3xl mx-auto text-primary-100">
            Your trusted partner in global trade since 2010
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To facilitate seamless global trade by providing high-quality products,
                reliable logistics, and exceptional customer service. We aim to bridge
                the gap between producers and consumers worldwide while maintaining
                the highest standards of integrity and professionalism.
              </p>
            </div>
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become a leading global trading company recognized for excellence,
                innovation, and sustainable business practices. We envision a world
                where trade barriers are minimized, and businesses can thrive through
                international cooperation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
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

      {/* Company History */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
          </div>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className="bg-primary-600 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">2010</div>
                </div>
              </div>
              <div className="md:w-3/4 card">
                <h3 className="text-xl font-semibold mb-2">Foundation</h3>
                <p className="text-gray-600">ITO Exim was founded with a vision to revolutionize international trade.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className="bg-primary-600 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">2015</div>
                </div>
              </div>
              <div className="md:w-3/4 card">
                <h3 className="text-xl font-semibold mb-2">Global Expansion</h3>
                <p className="text-gray-600">Expanded operations to 20+ countries across Asia, Europe, and Africa.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className="bg-primary-600 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">2020</div>
                </div>
              </div>
              <div className="md:w-3/4 card">
                <h3 className="text-xl font-semibold mb-2">Digital Transformation</h3>
                <p className="text-gray-600">Launched our CRM platform for better customer service and operations.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className="bg-primary-600 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">2024</div>
                </div>
              </div>
              <div className="md:w-3/4 card">
                <h3 className="text-xl font-semibold mb-2">Industry Leader</h3>
                <p className="text-gray-600">Recognized as one of the fastest-growing trading companies in the region.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Leadership Team</h2>
            <p className="text-gray-600 mt-4">Meet the experts driving our success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" alt="CEO" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold">Rajesh Kumar</h3>
              <p className="text-primary-600 mb-2">CEO & Founder</p>
              <p className="text-gray-600 text-sm">20+ years in international trade</p>
            </div>
            <div className="card text-center">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200" alt="COO" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold">Priya Sharma</h3>
              <p className="text-primary-600 mb-2">COO</p>
              <p className="text-gray-600 text-sm">Operations & Logistics expert</p>
            </div>
            <div className="card text-center">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" alt="CTO" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold">Amit Patel</h3>
              <p className="text-primary-600 mb-2">CTO</p>
              <p className="text-gray-600 text-sm">Digital transformation leader</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}