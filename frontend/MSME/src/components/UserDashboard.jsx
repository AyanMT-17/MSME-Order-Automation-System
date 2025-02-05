import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Products');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/products');
        setProducts(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
    };
    fetchProducts();
  }, []);

  const handlePlaceOrder = async (productId, quantity) => {
    try {
      await axios.post('http://localhost:5000/api/user/order', { productId, quantity });
      // Refresh products data if needed
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <button 
          onClick={() => setSelectedTab('Products')} 
          className={`mr-2 px-4 py-2 rounded ${selectedTab === 'Products' ? 'bg-gray-200' : ''}`}
        >
          Products
        </button>
        <button 
          onClick={() => setSelectedTab('Order History')} 
          className={`px-4 py-2 rounded ${selectedTab === 'Order History' ? 'bg-gray-200' : ''}`}
        >
          Order History
        </button>
      </div>
      {selectedTab === 'Products' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Products</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">{product.category}</td>
                  <td className="border p-2">${product.price}</td>
                  <td className="border p-2">
                    <input 
                      type="number" 
                      defaultValue="1" 
                      className="w-full p-2"
                    />
                  </td>
                  <td className="border p-2">
                    <button 
                      onClick={() => handlePlaceOrder(product.id, 1)} 
                      className="bg-black text-white px-4 py-2 rounded"
                    >
                      Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;