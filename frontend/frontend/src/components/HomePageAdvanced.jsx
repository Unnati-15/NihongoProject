import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const HomePageAdvanced = () => {
  const [activeTab, setActiveTab] = useState(1); // 1 for Page 1, 2 for Page 2
  const [view, setView] = useState('flashcards');
  const token = localStorage.getItem('token');
    return (
      <>
       
        <div className=" bg-gray-100 py-8 px-6">
          <div className="w-full max-w-screen-xl mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Tabs */}
            <div className="flex mb-6">
              <button
                className={`px-4 py-2 w-1/2 text-center ${activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setActiveTab(1)}
              >
                Quiz
              </button>
              <button
                className={`px-4 py-2 w-1/2 text-center ${activeTab === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setActiveTab(2)}
              >
                Flashcard
              </button>
              <button
                className={`px-4 py-2 w-1/2 text-center ${activeTab === 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setActiveTab(3)}
              >
                Write
              </button>
              <button
                className={`px-4 py-2 w-1/2 text-center ${activeTab === 4 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setActiveTab(4)}
              >
                More
              </button>
            </div>
  
            {/* Page 1 Content */}
            {activeTab === 1 && (
             <main className=" items-center justify-center bg-gray-100 py-8 px-6">
             <div className="w-full max-w-screen-xl bg-white rounded-lg shadow-lg p-6">
       
               {/* Quiz Image and Link */}
               <div className="text-center mb-12">
                 <a href="https://www.jlpt.jp/">
                   <img
                     src="/images/quiz.avif"
                     alt="JLPT"
                     id="img1"
                     className="mx-auto w-68 h-32 object-cover rounded-lg shadow-lg"
                   />
                 </a>
               </div>
       
               {/* Quiz Section */}
               <div className="exams1 ">
                 <h2 className="examsh text-3xl font-semibold text-primary mb-4">The Ultimate Knowledge Quiz: Beginner vs Advanced!</h2>
                 <p className="exams1p text-lg text-gray-700 leading-relaxed">
                 Whether you're just starting out or a pro, this quiz section has something for everyone. Test your knowledge across Beginner and Advanced levels, with fun and engaging questions that will push your skills to the limit.
                 Are you ready to rise to the challenge? Let’s see how far your knowledge can take you!
                 </p>
               </div>
       
       
               {/* Quiz Button */}
               <div className="exams4 text-center ">
                 <button className='btn btn-primary'>
                 <Link to='/quiz'
                 >
                   Take Quiz
                 </Link></button>
               </div>
       
             </div>
           </main>
            )}
  
            {/* Page 2 Content */}
            {activeTab === 2 && (
              <main className=" items-center justify-center bg-gray-100 py-12 px-6">
              <div className="w-full max-w-screen-xl bg-white rounded-lg shadow-lg p-6">
        
                {/* Flashcard Image and Link */}
                <div className="text-center mb-12">
                  <a href="https://www.jlpt.jp/">
                    <img
                      src="/images/flashcard.jpg"
                      alt="JLPT"
                      id="img1"
                      className="mx-auto w-68 h-32 object-cover rounded-lg shadow-lg"
                    />
                  </a>
                </div>
        
                {/* Flashcard Section */}
                <div className="exams1 ">
                  <h2 className="examsh text-3xl font-semibold text-primary mb-4">Flashcard Frenzy: Learn, Test, and Master!</h2>
                  <p className="exams1p text-lg text-gray-700 leading-relaxed">
                  Unlock the power of learning with our Flashcard View! Whether you're just starting or looking to reinforce your knowledge, our interactive flashcards make studying fun and effective.
                  Ready to dive in? Start creating and mastering new knowledge today! </p>
                </div>
        
        
                {/* Flashcard Button */}
               <div className="exams4 text-center">
                 <button className='btn btn-primary'>
                 <Link to="/flashcard"
                   href="https://www.jlpt.jp/"
                   className="linkjlpt text-xl  font-semibold hover:underline"
                 >
                  Flashcard
                 </Link></button>
                 </div>
              </div>
            </main>
          
            )}
            {/* Page 3 Content */}
            {activeTab === 3 && (
              <main className=" items-center justify-center bg-gray-100 py-12 px-6">
              <div className="w-full max-w-screen-xl bg-white rounded-lg shadow-lg p-6">
        
                {/* Write Image and Link */}
                <div className="text-center mb-12">
                  <a href="https://www.jlpt.jp/">
                    <img
                      src="/images/write.png"
                      alt="JLPT"
                      id="img1"
                      className="mx-auto w-68 h-32 object-cover rounded-lg shadow-lg"
                    />
                  </a>
                </div>
        
                {/* Write Section */}
                <div className="exams1 ">
                  <h2 className="examsh text-3xl font-semibold text-primary mb-4">Master Japanese By Writing!</h2>
                  <p className="exams1p text-lg text-gray-700 leading-relaxed">
                  Dive into Japanese learning with the ultimate tool to sharpen your skills!Take your Japanese learning to the next level—learn smarter, faster, and more effectively today!</p>
                </div>
        
        
                {/* Write Button */}
               <div className="exams4 text-center ">
                 <button className='btn btn-primary'>
                 <a
                   href="https://www.jlpt.jp/"
                   className="linkjlpt text-xl  font-semibold hover:underline"
                 >
                   Write
                 </a></button>
               </div>
        
              </div>
            </main>
          
            )}
            {/* Page 4 Content */}
            {activeTab === 4 && (
              <main className=" items-center justify-center bg-gray-100 py-12 px-6">
              <div className="w-full max-w-screen-xl bg-white rounded-lg shadow-lg p-6">
        
                {/* more Image and Link */}
                <div className="text-center mb-12">
                  <a href="https://www.jlpt.jp/">
                    <img
                      src="/images/more.jpg"
                      alt="JLPT"
                      id="img1"
                      className="mx-auto w-68 h-32 object-cover rounded-lg shadow-lg"
                    />
                  </a>
                </div>
        
                {/* More Section */}
                <div className="exams1 mb-12">
                  <h2 className="examsh text-3xl font-semibold text-primary mb-4">Use Transcription, Text-to-Audio, and Summarization!</h2>
                  <p className="exams1p text-lg text-gray-700 leading-relaxed">
                  Use the power of art to enhance your learning experience. Embrace your creativity and use these tools to elevate your learning journey today! </p>
                </div>
        
        
               {/* More Button */}
               <div className="exams4 text-center mb-12">
                 <button className='btn btn-primary'>
                 <a
                   href="https://www.jlpt.jp/"
                   className="linkjlpt text-xl  font-semibold hover:underline"
                 >
                   More
                 </a></button>
               </div>
        
              </div>
            </main>
          
            )}
           
            
          </div>
        </div>
      </>
    );
}
