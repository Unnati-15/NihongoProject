import React from 'react';
import { useState,useEffect } from 'react';

const InterpreterList = () => {
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
      return <div className="text-center text-xl">Loading...</div>;
    }
  
    return (
      <div className="p-5">
        <h1 className="text-3xl font-bold mb-5">Interpreter List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interpreters.map((interpreter) => (
            <div key={interpreter.id} className="card w-full max-w-sm bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{interpreter.user.first_name} {interpreter.user.last_name}</h2>
                <p><strong>Username:</strong> {interpreter.user.username}</p>
                <p><strong>Email:</strong> {interpreter.user.email}</p>
                <p><strong>Bio:</strong> {interpreter.bio}</p>
                <p><strong>Languages:</strong> {interpreter.language.map((lang, index) => (
                  <span key={index} className="badge badge-primary mr-2">{lang.language.name}</span>
                ))}</p>
                <p><strong>Certifications:</strong></p>
                <ul>
                  {interpreter.certification.map((cert, index) => (
                    <li key={index}>{cert.certification.name} ({cert.certification.issue_date} - {cert.certification.expiry_date})</li>
                  ))}
                </ul>
                <div>
                  <p><strong>Availability:</strong></p>
                  {interpreter.availability.length === 0 ? (
                    <p>No availability</p>
                  ) : (
                    <ul>
                      {interpreter.availability.map((avail, index) => (
                        <li key={index}>
                          {avail.day_of_week}: {new Date(avail.start_time).toLocaleString()} - {new Date(avail.end_time).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

export default InterpreterList;