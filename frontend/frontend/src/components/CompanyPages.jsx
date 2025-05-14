
import { useState, useEffect } from 'react';
import CompanyNavbar from "./CompanyNavbar";

export const CompanyPages = () => {
  const [interpreters, setInterpreters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
const [statusType, setStatusType] = useState(''); // 'success' or 'error'

  const [selectedInterpreter, setSelectedInterpreter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch interpreters
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

  // Fetch company bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/bookings/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);
  
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
  try {
    const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      const updatedBooking = await response.json();
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === updatedBooking.id ? updatedBooking : booking
        )
      );
      setStatusMessage(`Booking ${newStatus} successfully.`);
      setStatusType('success');
    } else {
      const error = await response.json();
      console.error('Failed to update booking:', error);
      setStatusMessage(error.detail || 'Failed to update booking.');
      setStatusType('error');
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    setStatusMessage('An error occurred while updating.');
    setStatusType('error');
  }
  setTimeout(() => {
    setStatusMessage(null);
    setStatusType('');
  }, 3000);
};

  const handleOpenInterpreterModal = (interpreter) => {
    setSelectedInterpreter(interpreter);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInterpreter(null);
  };

  if (loading) {
    return <div className="text-center text-xl text-purple-500">Loading...</div>;
  }

  return (
    <>
      <CompanyNavbar />
      {statusMessage && (
  <div className={`alert shadow-lg w-fit mx-auto mt-4 ${statusType === 'success' ? 'alert-success' : 'alert-error'}`}>
    <span>{statusMessage}</span>
  </div>
)}

      <div className="p-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Applications</h2>
        <div className="grid grid-cols-1 gap-6 mb-40">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                
                <p>
                  <strong>Interpreter:</strong>{' '}
                  <span
                    onClick={() => handleOpenInterpreterModal(booking.interpreter)}
                    className="text-blue-600 hover:underline cursor-pointer text-xl font-semibold  mb-2"
                  >
                    {booking.interpreter.user.first_name} {booking.interpreter.user.last_name}
                  </span>
                </p>
                <h3 className="text-xl font-semibold text-purple-700 mb-2">{booking.job_posting.job_title}</h3>
                <p><strong>Status:</strong> 
  <span className={`capitalize ml-1 font-semibold ${booking.status === 'pending' ? 'text-yellow-600' :
                      booking.status === 'accepted' ? 'text-green-600' :
                      booking.status === 'completed' ? 'text-blue-600' :
                      booking.status === 'cancelled' ? 'text-gray-600' :
                      booking.status === 'declined' ? 'text-red-600' : ''
                    }`}>
    {booking.status}
  </span>
  {booking.status === 'pending' && (
  <>
    <button
      onClick={() => handleUpdateBookingStatus(booking.id, 'accepted')}
      className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Accept
    </button>
    <button
      onClick={() => handleUpdateBookingStatus(booking.id, 'declined')}
      className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Decline
    </button>
  </>
)}

{booking.status === 'accepted' && (
  <>
    <button
      onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
      className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Mark as Completed
    </button>
    <button
      onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
      className="ml-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
    >
      Cancel
    </button>
  </>
)}

</p>

                <p><strong>Notes:</strong> {booking.notes}</p>
                <p><strong>Applied At:</strong> {new Date(booking.created_at).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-lg text-center">No interpreters have applied yet.</p>
          )}
        </div>

        {isModalOpen && selectedInterpreter && (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg w-full max-w-3xl shadow-lg relative overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700 text-center">Interpreter Details</h2>

      <div className="space-y-4 text-gray-800 text-lg">
        <p><strong>Name:</strong> {selectedInterpreter.user.first_name} {selectedInterpreter.user.last_name}</p>
        <p><strong>Username:</strong> {selectedInterpreter.user.username}</p>
        <p><strong>Email:</strong> {selectedInterpreter.user.email}</p>
        <p><strong>Phone:</strong> {selectedInterpreter.phone_number}</p>
        <p><strong>Address:</strong> {selectedInterpreter.address}</p>
        <p><strong>Bio:</strong> {selectedInterpreter.bio}</p>

        {/* Languages */}
        <div>
          <strong>Languages:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedInterpreter.language.length > 0 ? (
              selectedInterpreter.language.map((lang, index) => (
                <span key={index} className="px-2 py-1 bg-indigo-200 text-indigo-800 rounded text-sm">
                  {lang.language.name}
                </span>
              ))
            ) : (
              <span className="text-gray-500">No languages listed.</span>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <strong>Certifications:</strong>
          {selectedInterpreter.certification.length > 0 ? (
            <table className="w-full mt-2 border">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Issue Date</th>
                  <th className="px-3 py-2 text-left">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedInterpreter.certification.map((cert, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-3 py-1">{cert.certification.name}</td>
                    <td className="px-3 py-1">{cert.certification.issue_date}</td>
                    <td className="px-3 py-1">{cert.certification.expiry_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500 mt-1">No certifications listed.</p>
          )}
        </div>

        {/* Availability */}
        <div>
          <strong>Availability:</strong>
          {selectedInterpreter.availability.length > 0 ? (
            <table className="w-full mt-2 border">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-3 py-2 text-left">Day</th>
                  <th className="px-3 py-2 text-left">Start Time</th>
                  <th className="px-3 py-2 text-left">End Time</th>
                </tr>
              </thead>
              <tbody>
                {selectedInterpreter.availability.map((avail, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-3 py-1">{avail.day_of_week}</td>
                    <td className="px-3 py-1">{new Date(avail.start_time).toLocaleTimeString()}</td>
                    <td className="px-3 py-1">{new Date(avail.end_time).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500 mt-1">No availability info listed.</p>
          )}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleCloseModal}
        className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold"
      >
        &times;
      </button>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default CompanyPages;
