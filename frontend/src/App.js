import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this import is present

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', department: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('/api/employees')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Fetch Error:', err));
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editId === null) {
      axios.post('/api/employees', form)
        .then(() => {
          fetchEmployees();
          setForm({ name: '', age: '', department: '' });
        })
        .catch(err => console.error('Add Error:', err));
    } else {
      axios.put(`/api/employees/${editId}`, form)
        .then(() => {
          fetchEmployees();
          setForm({ name: '', age: '', department: '' });
          setEditId(null);
        })
        .catch(err => console.error('Update Error:', err));
    }
  };

  const handleEdit = (emp) => {
    setForm({ name: emp.name, age: emp.age, department: emp.department });
    setEditId(emp.id);
  };

  const handleDelete = (id) => {
    axios.delete(`/api/employees/${id}`)
      .then(() => fetchEmployees())
      .catch(err => console.error('Delete Error:', err));
  };

  return (
    <div className="container">
      <h1>Employee Management</h1>

      <div className="form-group">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="age"
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={handleChange}
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>
          {editId === null ? 'Add Employee' : 'Update Employee'}
        </button>
      </div>

      <ul className="employee-list">
        {employees.map(emp => (
          <li key={emp.id}>
            <span>{emp.name} - {emp.age} - {emp.department}</span>
            <button onClick={() => handleEdit(emp)}>Edit</button>
            <button onClick={() => handleDelete(emp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
