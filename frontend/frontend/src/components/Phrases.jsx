import { useState } from 'react';
import BeginnerNavbar from './BeginnerNavbar';
const Phrases = () => {
  // Define the data for the phrases
  const phrasesData = [
    { japanese: 'はい', romaji: 'Hai', english: 'Yes' },
    { japanese: 'いいえ', romaji: 'Iie', english: 'No' },
    { japanese: 'おねがいします', romaji: 'Onegaishimasu', english: 'Please' },
    { japanese: 'ありがとう', romaji: 'Arigatou', english: 'Thank you' },
    { japanese: 'どういたしまして', romaji: 'Douitashimashite', english: 'You are welcome' },
    { japanese: 'すみません', romaji: 'Sumimasen', english: 'Excuse me' },
    { japanese: 'ごめんなさい', romaji: 'Gomennasai', english: 'I am sorry' },
    { japanese: 'おはようございます', romaji: 'Ohayou gozaimasu', english: 'Good morning' },
    { japanese: 'こんばんは', romaji: 'Konbanwa', english: 'Good evening' },
    { japanese: 'おやすみなさい', romaji: 'Oyasumi nasai', english: 'Good night' },
    { japanese: 'だいじょうぶです', romaji: 'Daijoubu desu', english: 'That is all right' },
    { japanese: 'わかります', romaji: 'Wakarimasu', english: 'I understand you' },
    { japanese: 'おなまえはなんですか。', romaji: 'Onamae wa nan desu ka.', english: 'What is your name?' },
    { japanese: 'おげんきですか。', romaji: 'Ogenki desu ka.', english: 'How are you?' },
    { japanese: 'げんきです。', romaji: 'Genki desu.', english: 'I am fine.' },
    { japanese: 'もっと ゆっくりはなして いただけませんか。', romaji: 'Motto yukkuri hanashite itadakemasen ka.', english: 'Can you speak more slowly?' },
    { japanese: 'よくわかります。', romaji: 'Yoku wakarimasu.', english: 'I understand you perfectly.' },
    { japanese: 'わたしは にほんごがすこししかはなせません。', romaji: 'Watashi wa nihongo ga sukoshi shika hanasemasen.', english: 'Unfortunately, I speak only a little Japanese.' },
  ];

  // Pagination settings
  const itemsPerPage = 5; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index of the first and last item to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the data for the current page
  const currentPhrases = phrasesData.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(phrasesData.length / itemsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
    <BeginnerNavbar/>
    <main className="bg-cover bg-center" style={{ backgroundImage: 'url(images/2050691.jpg)' }}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 bg-opacity-90 p-6">
        {/* Self Introduction Section */}
        <ul className="list-none p-6 bg-base-100 rounded-xl shadow-lg w-full max-w-3xl mb-8">
          <li>
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">SELF INTRODUCTION IN JAPANESE</h2>
            <ul className="list-decimal pl-6 space-y-3">
              <li className="text-xl">Nice to meet you! [hajimemashite] [はじめまして。]</li>
              <li className="text-xl">My name is _______. [watashino namaewa _____desu] [わたしのなまえは____です。]</li>
              <li className="text-xl">I am from _______. [_____kara kimashita] [___からきました。]</li>
              <li className="text-xl">Thank you for your time / Please keep me in mind. [yoroshiku onegai shimasu] [よろしくおねがいします。]</li>
            </ul>
          </li>
        </ul>

        {/* Handy Phrases Table Section */}
        <ul className="phrases w-full max-w-3xl mb-8">
          <li>
            <h2 className="text-3xl font-bold mb-6 text-center">SOME HANDY PHRASES</h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border-b px-4 py-3 text-xl font-medium">JAPANESE</th>
                    <th className="border-b px-4 py-3 text-xl font-medium">ROMAJI</th>
                    <th className="border-b px-4 py-3 text-xl font-medium">ENGLISH</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPhrases.map((phrase, index) => (
                    <tr key={index}>
                      <td className="border-b px-4 text-xl py-2">{phrase.japanese}</td>
                      <td className="border-b px-4 text-xl py-2">{phrase.romaji}</td>
                      <td className="border-b px-4 text-xl py-2">{phrase.english}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </li>
        </ul>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrevPage}
            className="btn btn-primary"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-lg font-medium">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={handleNextPage}
            className="btn btn-primary"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </main></>
  );
}

export default Phrases;
