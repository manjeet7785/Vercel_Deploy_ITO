import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { productsApi } from '../../api/products';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const response = await productsApi.getProducts('all');
        if (response.success) {
          setDbProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching database products:', error);
      }
    };
    fetchDbProducts();
  }, []);

  const staticProducts = [
    {
      id: 1,
      origin: 'India',
      price: '20-50/kg',
      name: 'RM Natural Unpolished Decorative Pebbles for Home & Garden Decor',
      image: 'https://m.media-amazon.com/images/I/61FSFnx6r-L._SL1024_.jpg',
      category: 'Minerals & Construction',
      description: 'RM Natural Unpolished Decorative Pebbles for Home & Garden Decor (5kg, Rainbow, 20-50mm) | Raw Natural Stones for Landscaping, Plant Pots, Fillers, Aquarium, Pathways, Indoor Outdoor Use'
    },
    {
      id: 2,
      origin: 'India',
      price: '20-50/kg',
      name: 'Solid Natural Stone ',
      image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSwiWjzogncwMWMQlEe7c4SMhst0Rle2wP7KS9PYFWU0FmAqF4zXlPU0XT9fKdA1v4MDDMoqhkqnthlc5Qwnada7xkk1BMW',
      category: 'Construction',
      description: 'Solid Natural Stone- 60 mm Size, Heat-Resistant and Durable for Building Applications'
    },
    {
      id: 3,
      origin: 'India',
      price: '20-50/kg',
      name: 'Reflectix Expansion Joint',
      image: 'https://m.media-amazon.com/images/I/41AWyJc1pWL._AC_UF1000,1000_QL80_.jpg',
      category: 'Construction',
      description: 'Reflectix Expansion Joint.'
    },
    {
      id: 4,
      origin: "India",
      price: '20-50/kg',
      name: 'Gfrp Fiberglass Bar, Epoxy Composite Fiberglass Rebar',
      image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTz7SO8-Tud-Feg53A0TptPFRY6zRCkI7Z5Abg_KC4fCccB7MSJWB9rDk7yZr-to8vgPoVt42xMlRJP6YY4JTVhuM0WUBDM",
      category: 'Fiberglass Rebar',
      description: 'Gfrp Fiberglass Bar, Epoxy Composite Fiberglass Rebar'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'stone', label: 'Natural Stones' },
    { value: 'Minerals & Construction', label: 'Minerals & Construction' },
    { value: 'Construction', label: 'Construction' },
    { value: 'Fiberglass Rebar', label: 'Fiberglass Rebar' },
    { value: 'coal', label: 'Coal' },
    { value: 'tea', label: 'Tea' },
    { value: 'rice', label: 'Rice' },
  ];

  const products = [...dbProducts, ...staticProducts];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <p className="text-gray-600 mt-4">Discover our wide range of premium quality products</p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="w-64">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div key={product._id || product.id} className="card hover:shadow-lg transition">
            <img src={product.image || product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-semibold mb-2 break-all">{product.name}</h3>
            <p className="text-gray-600 mb-2 break-all">{product.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>Origin: {product.origin}</span>
              <span>Price: {product.price}</span>
            </div>
            <Link to="/quote-request" className="btn-primary w-full text-center block">
              Request Quote
            </Link>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}