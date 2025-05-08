import React, { useState, useEffect } from 'react';
import CompanyNavbar from "./CompanyNavbar";

export const CompanyPages = () => {
  const [interpreters, setInterpreters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    const fetchInterpreters = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/interpreters/');
        const data = await response.json();
        setInterpreters(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching interpreters:', error);
        setLoading(false);
      }
    };

    fetchInterpreters();
  }, []);

  if (loading) {
    return <div className="text-center text-xl text-purple-500">Loading...</div>;
  }

  return (
    <>
    <CompanyNavbar/>
    <div className="p-6">
      
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Interpreters' List</h1>

      {/* Cards for each interpreter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-2xl mb-40">
        {interpreters.map((interpreter) => (
          <div key={interpreter.id} className="card w-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg border border-gray-200 hover:bg-purple-50">
            {/* <figure>
              <img
                className="w-full h-48 object-cover rounded-t-lg"
                src="https://placeimg.com/400/200/people"
                alt={`${interpreter.user.first_name} ${interpreter.user.last_name}`}
              />
            </figure> */}
            <div className="card-body p-5">
              <h2 className="card-title text-2xl font-semibold text-purple-700">
                {interpreter.user.first_name} {interpreter.user.last_name}
              </h2>

              {/* Details: Username, Email, Phone */}
              <div className="mt-3 ">
                <p className="text-xl text-gray-700">
                  <strong className="font-medium text-gray-900 ">Username:</strong> {interpreter.user.username}
                </p>
                <p className="text-xl text-gray-700">
                  <strong className="font-medium text-gray-900">Email:</strong> {interpreter.user.email}
                </p>
                <p className="text-xl text-gray-700">
                  <strong className="font-medium text-gray-900">Phone Number:</strong> {interpreter.phone_number}
                </p>
                <p className="text-xl text-gray-700">
                  <strong className="font-medium text-gray-900">Address:</strong> {interpreter.address}
                </p>
                <p className="text-xl text-gray-700">
                  <strong className="font-medium text-gray-900">Bio:</strong> {interpreter.bio}
                </p>
              </div>

              {/* Languages Section with Badges */}
              <div className="mt-3 p-4 rounded-lg bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100">
                <strong className="text-lg text-gray-900">Languages:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {interpreter.language.length > 0 ? (
                    interpreter.language.map((lang, index) => (
                      <span key={index} className="badge badge-primary text-white">{lang.language.name}</span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No languages available</span>
                  )}
                </div>
              </div>

              {/* Certifications Section with a Table */}
              <div className="mt-5">
                <strong className="text-lg text-gray-900">Certifications:</strong>
                <div className="overflow-x-auto mt-2">
                  <table className="table w-full table-auto border-separate border-spacing-0 rounded-lg shadow-lg">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Certification Name</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interpreter.certification.length > 0 ? (
                        interpreter.certification.map((cert, index) => (
                          <tr key={index} className="hover:bg-purple-50">
                            <td className="px-3 py-2 text-sm text-gray-700">{cert.certification.name}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">{cert.certification.issue_date}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">{cert.certification.expiry_date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-3 py-2 text-sm text-gray-500" colSpan="3">No certifications available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Availability Section with a Table */}
              <div className="mt-5">
                <strong className="text-lg text-gray-900">Availability:</strong>
                <div className="overflow-x-auto mt-2">
                  <table className="table w-full table-auto border-separate border-spacing-0 rounded-lg shadow-lg">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Day</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Start Time</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">End Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interpreter.availability.length > 0 ? (
                        interpreter.availability.map((avail, index) => (
                          <tr key={index} className="hover:bg-green-50">
                            <td className="px-3 py-2 text-sm text-gray-700">{avail.day_of_week}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">{new Date(avail.start_time).toLocaleString()}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">{new Date(avail.end_time).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-3 py-2 text-sm text-gray-500" colSpan="3">No availability</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div></>
  );
};

export default CompanyPages;
