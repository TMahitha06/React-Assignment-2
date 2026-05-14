import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: ''
  });
  
  const itemsPerPage = 5;
  const API_URL = 'http://localhost:3001/users';

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users. Make sure backend is running!');
    }
  };

  const addUser = async (user) => {
    try {
      await axios.post(API_URL, user);
      await loadUsers();
      alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user');
    }
  };

  const updateUser = async (id, user) => {
    try {
      await axios.put(`${API_URL}/${id}`, user);
      await loadUsers();
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        await loadUsers();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', mobile: '', city: '' });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setShowForm(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    user.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const goToPreviousPage = () => setCurrentPage(currentPage - 1);
  const goToNextPage = () => setCurrentPage(currentPage + 1);
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="app-container">
      <h1 className="app-title">User Management System</h1>
      
      {/* Header with Button and Search */}
      <div className="header-section">
        <button className="add-button" onClick={() => setShowForm(true)}>
          Add New User
        </button>
        
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, mobile, or city..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Modal Popup Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-input"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input
                type="email"
                className="form-input"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input
                type="tel"
                className="form-input"
                placeholder="Mobile Number (10 digits)"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              />
              <input
                type="text"
                className="form-input"
                placeholder="City"
                required
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
              <div className="form-buttons">
                <button type="submit" className="save-button">Save</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Table */}
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr className="table-header">
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No users found. Click "Add New User" to create one.
                </td>
              </tr>
            ) : (
              currentUsers.map(user => (
                <tr key={user.id} className="table-row">
                  <td className="user-name"><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.city}</td>
                  <td className="action-buttons">
                    <button className="edit-button" onClick={() => handleEdit(user)}>
                       Edit
                    </button>
                    <button className="delete-button" onClick={() => deleteUser(user.id)}>
                       Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-section">
          <button 
            className="page-button"
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
          >
             Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => goToPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            className="page-button"
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
          >
            Next 
          </button>
        </div>
      )}
      
      <p className="info-text">
        Showing {filteredUsers.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, filteredUsers.length)} of {filteredUsers.length} users
      </p>
    </div>
  );
}

export default App;