import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InterpreterNavbar from './InterpreterNavbar';

const InterpreterBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/interpreter/bookings/', {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      setBookings(response.data);
    })
    .catch(error => {
      console.error('Error fetching bookings:', error);
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#facc15'; // yellow
      case 'accepted': return '#34d399'; // green
      case 'confirmed': return '#60a5fa'; // blue
      case 'completed': return '#10b981'; // teal
      case 'cancelled': return '#f87171'; // red
      default: return '#d1d5db'; // gray
    }
  };

  return (
    <>
    <InterpreterNavbar />
    <div style={styles.container}>
      <h2 style={styles.title}>📅 Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div style={styles.cardContainer}>
          {bookings.map((booking) => (
            <div key={booking.id} style={styles.card}>
              <h3 style={styles.jobTitle}>{booking.job_posting.job_title}</h3>
              <p><strong>Company:</strong> {booking.job_posting?.company?.user?.username || 'N/A'}</p>
              <p><strong>Location:</strong> {booking.job_posting.location}</p>
              <p><strong>Date & Time:</strong> {new Date(booking.job_posting.date_time).toLocaleString()}</p>
              {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
              <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(booking.status) }}>
                {booking.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div></>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  cardContainer: {
    display: 'grid',
    gap: '1.5rem',
  },
  card: {
    padding: '1.5rem',
    borderRadius: '8px',
    background: '#f9fafb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #3b82f6',
  },
  jobTitle: {
    marginBottom: '0.5rem',
    color: '#1f2937',
  },
  statusBadge: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
};

export default InterpreterBookings;
