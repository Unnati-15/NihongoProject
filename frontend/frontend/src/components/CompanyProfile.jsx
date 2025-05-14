import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/company/${companyData.id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      }
    })
    .then((res) => {
        console.log(res.data);
      setCompanyData(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Failed to fetch company data:', err);
      toast.error('Failed to load profile data');
    });
  }, []);

  const handleCompanyChange = (e) => {
  const { name, value } = e.target;
  setCompanyData((prevData) => ({
    ...prevData,
    [name]: value
  }));
};


  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      user: {
        ...prevData.user,
        [name]: value,
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.patch(`http://localhost:8000/api/company/${companyData.id}/`, companyData, {
      headers: {
        Authorization: `Token ${token}`,
      }
    })
    .then((res) => {
      toast.success('Profile updated successfully!');
    })
    .catch((err) => {
      console.error('Update failed:', err);
      toast.error('Failed to update profile');
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white rounded shadow">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-center">Update Company Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name Fields */}
        <div className="flex space-x-4">
          <input type="text" name="first_name" value={companyData.user.first_name}
            onChange={handleUserChange} placeholder="First Name"
            className="input input-bordered w-full" />

          <input type="text" name="last_name" value={companyData.user.last_name}
            onChange={handleUserChange} placeholder="Last Name"
            className="input input-bordered w-full" />
        </div>

        {/* Username & Email */}
        <div className="flex space-x-4">
          <input type="text" name="username" value={companyData.user.username}
            onChange={handleUserChange} placeholder="Username"
            className="input input-bordered w-full" />

          <input type="email" name="email" value={companyData.user.email}
            onChange={handleUserChange} placeholder="Email"
            className="input input-bordered w-full" />
        </div>

        {/* Phone & Address */}
        <div className="flex space-x-4">
          <input type="text" name="phone_number" value={companyData.phone_number}
            onChange={handleCompanyChange} placeholder="Phone Number"
            className="input input-bordered w-full" />

          <input type="text" name="address" value={companyData.address}
            onChange={handleCompanyChange} placeholder="Address"
            className="input input-bordered w-full" />
        </div>

        {/* About */}
        <textarea name="about" value={companyData.about}
          onChange={handleChange} placeholder="About your company"
          className="textarea textarea-bordered w-full h-32" />

        <button type="submit" className="btn btn-primary w-full">Update Profile</button>
      </form>
    </div>
  );
};

export default CompanyProfile;
