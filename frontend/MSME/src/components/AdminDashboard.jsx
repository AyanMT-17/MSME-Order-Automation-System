import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Inventory');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/products');
        setInventory(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
    };
    fetchInventory();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/inventory/${productId}`, { stock: quantity });
      // Refresh inventory data
      const response = await axios.get('http://localhost:5000/api/admin/products');
      setInventory(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/admin/inventory/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Refresh inventory data
      const response = await axios.get('http://localhost:5000/api/products');
      setInventory(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4">
        <button 
          onClick={() => setSelectedTab('Inventory')} 
          className={`mr-2 px-4 py-2 rounded ${selectedTab === 'Inventory' ? 'bg-gray-200' : ''}`}
        >
          Inventory
        </button>
        <button 
          onClick={() => setSelectedTab('Orders')} 
          className={`px-4 py-2 rounded ${selectedTab === 'Orders' ? 'bg-gray-200' : ''}`}
        >
          Orders
        </button>
      </div>
      {selectedTab === 'Inventory' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
          <p className="text-gray-600 mb-4">Update quantities or add new items to your inventory.</p>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">{item.stock}</td>
                  <td className="border p-2">
                    <input 
                      type="number" 
                      defaultValue={item.stock} 
                      onChange={(e) => handleUpdateQuantity(item.id, e.target.value)} 
                      className="w-full p-2"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="text-xl font-bold mt-6">Bulk Add Inventory</h3>
          <input 
            type="file" 
            onChange={handleFileUpload} 
            className="mt-2"
          />
          <button 
            className="bg-black text-white px-4 py-2 rounded mt-2"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;