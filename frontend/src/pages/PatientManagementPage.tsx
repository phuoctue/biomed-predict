import React, { useState } from 'react';
import { usePatient } from '../hooks/useAPI';

export const PatientManagementPage: React.FC = () => {
  const { patient, loading, error, createPatient } = usePatient();
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'MALE',
    dateOfBirth: '',
    citizenId: '',
    phone: '',
    email: '',
    address: '',
    bloodType: 'O',
    insuranceNumber: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPatient(formData);
      setFormData({
        fullName: '',
        gender: 'MALE',
        dateOfBirth: '',
        citizenId: '',
        phone: '',
        email: '',
        address: '',
        bloodType: 'O',
        insuranceNumber: '',
      });
      alert('Patient created successfully');
    } catch (err) {
      alert('Failed to create patient');
    }
  };

  return (
    <div className="patient-management">
      <h1>Patient Management</h1>
      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleInputChange}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Citizen ID:</label>
          <input
            type="text"
            name="citizenId"
            value={formData.citizenId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Blood Type:</label>
          <input
            type="text"
            name="bloodType"
            value={formData.bloodType}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Patient'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {patient && <div className="success-message">Patient created: {patient.fullName}</div>}
    </div>
  );
};
