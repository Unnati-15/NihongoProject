// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Decks = () => {
//   const [decks, setDecks] = useState([]);
//   const [newDeckName, setNewDeckName] = useState('');
//   const [newDeckDescription, setNewDeckDescription] = useState('');
  
//   useEffect(() => {
//     fetchDecks();
//   }, []);

//   const fetchDecks = async () => {
//     try {
//       const token = localStorage.getItem('token'); // Assuming the token is saved in localStorage
//       if (!token) {
//         console.error('Token is missing');
//         return;
//       }

//       // Fetch the decks
//       const response = await axios.get('http://localhost:8000/api/decks/', {
//         headers: {
//           Authorization: `Token ${token}`, // Use the 'Token' prefix for DRF token authentication
//         },
//       });
//       setDecks(response.data);
//     } catch (error) {
//       console.error('Error fetching decks:', error);
//     }
//   };

//   const handleCreateDeck = async (e) => {
//     e.preventDefault();
//     if (!newDeckName || !newDeckDescription) return;

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('Token is missing');
//         return;
//       }

//       const response = await axios.post(
//         'http://localhost:8000/api/decks/',
//         {
//           name: newDeckName,
//           description: newDeckDescription,
//         },
//         {
//           headers: {
//             Authorization: `Token ${token}`, // Use the 'Token' prefix for DRF token authentication
//           },
//         }
//       );

//       // Add the new deck to the decks list
//       setDecks((prev) => [...prev, response.data]);

//       // Reset the form
//       setNewDeckName('');
//       setNewDeckDescription('');
//     } catch (error) {
//       console.error('Error creating deck:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto">
//       <h1 className="text-2xl font-semibold my-4">Flashcard Decks</h1>
      
//       <div className="space-y-4">
//         <h2 className="text-xl">Create New Deck</h2>
//         <form onSubmit={handleCreateDeck} className="space-y-4">
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Deck Name</span>
//             </label>
//             <input
//               type="text"
//               value={newDeckName}
//               onChange={(e) => setNewDeckName(e.target.value)}
//               className="input input-bordered"
//               placeholder="Enter deck name"
//             />
//           </div>
          
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Description</span>
//             </label>
//             <input
//               type="text"
//               value={newDeckDescription}
//               onChange={(e) => setNewDeckDescription(e.target.value)}
//               className="input input-bordered"
//               placeholder="Enter deck description"
//             />
//           </div>

//           <button type="submit" className="btn btn-primary">Create Deck</button>
//         </form>
//       </div>

//       <div className="mt-6">
//         <h2 className="text-xl">Your Decks</h2>
//         <ul className="space-y-4">
//           {decks.map((deck) => (
//             <li key={deck.id} className="p-4 border rounded-lg">
//               <h3 className="text-lg">{deck.name}</h3>
//               <p>{deck.description}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Decks;
