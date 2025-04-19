import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [phonebook, setPhonebook] = useState([]);

  // Fetch all phone records
  useEffect(() => {
    fetchPhonebook();
  }, []);

  const fetchPhonebook = () => {
    Axios.get('http://localhost:8080/get-phone')
      .then(res => {
        setPhonebook(res.data.data.phoneNumbers);
      })
      .catch(err => alert('Error fetching phonebook: ' + err));
  };

  // Add a new phone entry
  const addNewNumber = () => {
    if (!name || !phone) return alert('Please enter name and phone');
    Axios.post('http://localhost:8080/add-phone', { name, phone })
      .then(() => {
        setName('');
        setPhone('');
        fetchPhonebook();
      })
      .catch(err => alert('Error adding phone: ' + err));
  };

  // Update an existing phone number
  const updatePhone = (id) => {
    if (!newPhone) return alert('Enter new phone number');
    Axios.patch(`http://localhost:8080/update-phone/${id}`, { phone: newPhone })
      .then(() => {
        setNewPhone('');
        fetchPhonebook();
      })
      .catch(err => alert('Error updating phone: ' + err));
  };

  // Delete a phone entry
  const deletePhone = (id) => {
    Axios.delete(`http://localhost:8080/delete-phone/${id}`)
      .then(() => {
        fetchPhonebook();
      })
      .catch(err => alert('Error deleting phone: ' + err));
  };

  return (
    <div className="container">
      <h1>📞 PhoneBook</h1>

      <label>Name: </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <label>Phone: </label>
      <input
        type="number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      /><br /><br />

      <button onClick={addNewNumber}>Add New Number</button>

      <hr />

      {phonebook.map((val) => (
        <div key={val._id} className="phone">
          <h3>{val.name}</h3>
          <h4>{val.phone}</h4>
          <input
            type="number"
            placeholder="Update Phone..."
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <button className="update-btn" onClick={() => updatePhone(val._id)}>Update</button>
          <button className="delete-btn" onClick={() => deletePhone(val._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
