import React from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiShield, FiClock, FiBarChart2, FiUsers, FiGlobe } from 'react-icons/fi';

export default function Home() {
  const features = [
    { icon: FiTruck, title: 'Global Logistics', description: 'End-to-end supply chain solutions across continents' },
    { icon: FiShield, title: 'Quality Assurance', description: 'Rigorous quality control at every stage' },
    { icon: FiClock, title: 'Timely Delivery', description: 'On-time delivery guaranteed' },
    { icon: FiBarChart2, title: 'Market Intelligence', description: 'Real-time market insights and pricing' },
    { icon: FiUsers, title: 'Expert Team', description: 'Dedicated professionals for your needs' },
    { icon: FiGlobe, title: 'Worldwide Network', description: 'Strong partnerships across the globe' }
  ];

  const products = [
    { name: 'Natural Stones', image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400', description: 'Premium quality granite, marble, and sandstone' },
    { name: 'Coal', image: 'https://images.unsplash.com/photo-1581094288338-1a3eb6e1c5a4?w=400', description: 'High-grade industrial and thermal coal' },
    { name: 'Tea', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb77374?w=400', description: 'Premium tea leaves from finest estates' },
    { name: 'Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001b0e5?w=400', description: 'Basmati and non-basmati rice varieties' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Global Trade Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Your Trusted Partner in International Import-Export
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/quote-request" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Get a Quote
              </Link>
              <Link to="/products" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition">
                Our Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">50+</div>
              <div className="text-gray-600 mt-2">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">1000+</div>
              <div className="text-gray-600 mt-2">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">5000+</div>
              <div className="text-gray-600 mt-2">Shipments Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">24/7</div>
              <div className="text-gray-600 mt-2">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Products</h2>
            <p className="text-gray-600 mt-4">Premium quality products sourced from best origins</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={index} className="card hover:shadow-lg transition">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="text-gray-600 mt-4">We provide comprehensive solutions for all your trading needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="inline-flex p-3 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="text-primary-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl mb-8 text-primary-100">Get in touch with our experts for a free consultation</p>
          <Link to="/contact" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}