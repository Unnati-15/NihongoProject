import { useState } from "react";

const Resources = () => {
  const [activeTab, setActiveTab] = useState(1); // 1 for Page 1, 2 for Page 2

  return (
    <>
     
      <div className="min-h-screen bg-gray-100 py-12 px-6">
        <div className="w-full max-w-screen-xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {/* Tabs */}
          <div className="flex mb-6">
            <button
              className={`px-4 py-2 w-1/2 text-center ${activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setActiveTab(1)}
            >
              JLPT Examination Details
            </button>
            <button
              className={`px-4 py-2 w-1/2 text-center ${activeTab === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setActiveTab(2)}
            >
              Study Resources
            </button>
          </div>

          {/* Page 1 Content */}
          {activeTab === 1 && (
           <main className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6">
           <div className="w-full max-w-screen-xl bg-white rounded-lg shadow-lg p-6">
     
             {/* JLPT Image and Link */}
             <div className="text-center mb-12">
               <a href="https://www.jlpt.jp/">
                 <img
                   src="/images/jlpt.jfif"
                   alt="JLPT"
                   id="img1"
                   className="mx-auto w-68 h-32 object-cover rounded-lg shadow-lg"
                 />
               </a>
             </div>
     
             {/* What is JLPT Section */}
             <div className="exams1 mb-12">
               <h2 className="examsh text-3xl font-semibold text-primary mb-4">WHAT IS JLPT?</h2>
               <p className="exams1p text-lg text-gray-700 leading-relaxed">
                 The Japanese-Language Proficiency Test (日本語能力試験, Nihongo Nōryoku Shiken), or JLPT, is a standardized criterion-referenced test to evaluate and certify Japanese language proficiency for non-native speakers, covering language knowledge, reading ability, and listening ability. 
                 The test is held twice a year in Japan and selected countries (on the first Sunday of July and December), and once a year in other regions (on the first Sunday of December). The JLPT consists of five levels. Until 2009, the test had four levels, with 4 being the lowest and 1 being the highest level of certification. JLPT certificates do not expire nor become invalid over time.
               </p>
             </div>
     
             {/* JLPT Levels Details */}
             <div className="exams2 mb-12">
               <h2 className="examsh text-3xl font-semibold text-primary mb-4">DETAILS ABOUT LEVELS OF JLPT</h2>
               <table className="wikitable w-full table-auto text-left shadow-lg bg-white rounded-lg overflow-hidden">
                 <thead>
                   <tr>
                     <th className="px-6 py-4 font-semibold text-lg bg-gray-200">Level</th>
                     <th className="px-6 py-4 font-semibold text-lg bg-gray-200">Linguistic Competence</th>
                   </tr>
                 </thead>
                 <tbody>
                   {/* N1 Level */}
                   <tr>
                     <td className="px-6 py-4">N1</td>
                     <td className="px-6 py-4">
                       <p><strong>Advanced Level</strong></p>
                       <p>Ability to understand Japanese used in a variety of circumstances.</p>
                       <p><strong>Reading:</strong> Ability to read writings with logical complexity and/or abstract writings on various topics.</p>
                       <p><strong>Listening:</strong> Ability to comprehend a wide range of spoken materials at natural speed, such as news reports and lectures.</p>
                     </td>
                   </tr>
                   {/* N2 Level */}
                   <tr>
                     <td className="px-6 py-4">N2</td>
                     <td className="px-6 py-4">
                       <p><strong>Pre-Advanced Level</strong></p>
                       <p>Ability to understand Japanese used in everyday situations to a certain degree.</p>
                       <p><strong>Reading:</strong> Ability to read materials on various topics, such as articles and commentaries in newspapers and magazines.</p>
                       <p><strong>Listening:</strong> Ability to comprehend spoken materials such as conversations and news reports, spoken at nearly natural speed.</p>
                     </td>
                   </tr>
                   {/* N3 Level */}
                   <tr>
                     <td className="px-6 py-4">N3</td>
                     <td className="px-6 py-4">
                       <p><strong>Intermediate Level</strong></p>
                       <p>Ability to understand Japanese used in everyday situations to a certain degree.</p>
                       <p><strong>Reading:</strong> Ability to read and understand written materials on everyday topics, including newspaper headlines.</p>
                       <p><strong>Listening:</strong> Ability to comprehend conversations in everyday situations, spoken at near-natural speed.</p>
                     </td>
                   </tr>
                   {/* N4 Level */}
                   <tr>
                     <td className="px-6 py-4">N4</td>
                     <td className="px-6 py-4">
                       <p><strong>Elementary Level</strong></p>
                       <p>Ability to understand basic Japanese.</p>
                       <p><strong>Reading:</strong> Ability to read passages on familiar daily topics written in basic vocabulary and kanji.</p>
                       <p><strong>Listening:</strong> Ability to understand conversations encountered in daily life, provided they are spoken slowly.</p>
                     </td>
                   </tr>
                   {/* N5 Level */}
                   <tr>
                     <td className="px-6 py-4">N5</td>
                     <td className="px-6 py-4">
                       <p><strong>Basic Level</strong></p>
                       <p>Ability to understand some basic Japanese.</p>
                       <p><strong>Reading:</strong> Ability to read and understand typical expressions and sentences in hiragana, katakana, and basic kanji.</p>
                       <p><strong>Listening:</strong> Ability to understand conversations on regular topics, spoken slowly in daily life and classroom situations.</p>
                     </td>
                   </tr>
                 </tbody>
               </table>
             </div>
     
             {/* JLPT Test Format Image */}
             <div className="exams3 text-center mb-12">
               <h2 className="examsh text-3xl font-semibold text-primary mb-4">TEST FORMAT</h2>
               <img
                 src="/images/JLPT-Levels.png"
                 alt="JLPT Levels"
                 className="imgex mx-auto w-full md:w-3/4 rounded-lg shadow-lg"
               />
             </div>
     
             {/* JLPT Link */}
             <div className="exams4 text-center mb-12">
               <p className="examp2 text-lg text-gray-700 mb-4">
                 To look for more information about JLPT, click the link below:
               </p>
               <a
                 href="https://www.jlpt.jp/"
                 className="linkjlpt text-xl text-blue-500 font-semibold hover:underline"
               >
                 JAPANESE LANGUAGE PROFICIENCY TEST WEBSITE
               </a>
             </div>
     
           </div>
         </main>
          )}

          {/* Page 2 Content */}
          {activeTab === 2 && (
            <main className="min-h-screen bg-gray-100 py-12 px-6">
            <div className="container mx-auto max-w-7xl">
        
              {/* Header Image */}
              <div className="mb-12">
                <img src="/images/header-1280x.jpg" alt="RESOURCES" className="w-full rounded-lg shadow-lg"/>
              </div>
        
              {/* Blogs Section */}
              <section className="mb-16">
                <h2 className="text-3xl font-semibold text-primary mb-6 flex items-center">
                  <img src="/images/usanin-favicon.png" width="40" height="40" alt="favicon" className="mr-3"/> BLOGS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <a href="https://japanswitch.com/guide-to-japanese-tips/">
                      <img src="/images/JapanSwitch.webp" alt="JapanSwitch" className="w-full h-64 object-cover rounded-md mb-4"/>
                    </a>
                    <h3 className="text-xl font-semibold mb-2">
                      <a href="https://japanswitch.com/guide-to-japanese-tips/" className="text-blue-500 hover:underline">
                        Guide to Japanese Study Tips
                      </a>
                    </h3>
                    <p className="text-gray-700 text-sm">
                      This article serves as a guide on Japanese study tips for both formal and fun study methods. This article is part of an extensive series of guides on Studying Japanese.
                    </p>
                  </div>
        
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <a href="https://japanswitch.com/guide-to-japanese-culture-shock/">
                      <img src="/images/JapanSwitch.webp" alt="JapanSwitch" className="w-full h-64 object-cover rounded-md mb-4"/>
                    </a>
                    <h3 className="text-xl font-semibold mb-2">
                      <a href="https://japanswitch.com/guide-to-japanese-culture-shock/" className="text-blue-500 hover:underline">
                        Guide to Japanese Culture Shock
                      </a>
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Japan is a perfect example of how old traditions live in harmony with the modern world. It can be difficult to navigate as a foreigner, so we have compiled an article with an abundant amount of information to help you handle the transition!
                    </p>
                  </div>
        
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <a href="https://japanswitch.com/guide-to-japanese-friends/">
                      <img src="/images/JapanSwitch.webp" alt="JapanSwitch" className="w-full h-64 object-cover rounded-md mb-4"/>
                    </a>
                    <h3 className="text-xl font-semibold mb-2">
                      <a href="https://japanswitch.com/guide-to-japanese-friends/" className="text-blue-500 hover:underline">
                        Top 15 Tips to Make Japanese Friends
                      </a>
                    </h3>
                    <p className="text-gray-700 text-sm">
                      When it comes to making Japanese friends, there are numerous possible approaches. This article has narrowed the possibilities down to the TOP 15 tips, you’ll be making Japanese friends in no time!
                    </p>
                  </div>
                </div>
              </section>
        
              {/* Podcasts Section */}
              <section className="mb-16">
                <h2 className="text-3xl font-semibold text-primary mb-6 flex items-center">
                  <img src="/images/usanin-favicon.png" width="40" height="40" alt="favicon" className="mr-3"/> PODCASTS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <a href="https://www.tofugu.com/podcast/">
                      <img src="/images/tofugu-japanese-podcast-300x188.webp" alt="Tofugu" className="w-full h-64 object-cover rounded-md mb-4"/>
                    </a>
                    <h3 className="text-xl font-semibold mb-2">
                      <a href="https://www.tofugu.com/podcast/" className="text-blue-500 hover:underline">
                        The Tofugu Podcast
                      </a>
                    </h3>
                  </div>
        
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <a href="https://www.japanesepod101.com/">
                      <img src="/images/japanesepod101.webp" alt="JapanesePod101" className="w-full h-64 object-cover rounded-md mb-4"/>
                    </a>
                    <h3 className="text-xl font-semibold mb-2">
                      <a href="https://www.japanesepod101.com/" className="text-blue-500 hover:underline">
                        JapanesePod101
                      </a>
                    </h3>
                  </div>
        
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <a href="https://learnjapanesepod.com/">
                      <img src="/images/learn-japanese-pod-400x400.webp" alt="Learn Japanese Pod" className="w-full h-64 object-cover rounded-md mb-4"/>
                    </a>
                    <h3 className="text-xl font-semibold mb-2">
                      <a href="https://learnjapanesepod.com/" className="text-blue-500 hover:underline">
                        Learn Japanese Pod
                      </a>
                    </h3>
                  </div>
                </div>
              </section>
        
              {/* Websites Section */}
              <section className="mb-16">
                <h2 className="text-3xl font-semibold text-primary mb-6 flex items-center">
                  <img src="/images/usanin-favicon.png" width="40" height="40" alt="favicon" className="mr-3"/> WEBSITES
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <a href="https://tadoku.org/japanese/free-books/">
                      <img src="/images/eyecatch.png" alt="Tadoku" className="w-full h-64 object-cover rounded-md mb-4"/>
                    </a>
                    <h3 className="text-xl font-semibold mb-2">
                      <a href="https://tadoku.org/japanese/free-books/" className="text-blue-500 hover:underline">
                        Tadoku Books
                      </a>
                    </h3>
                  </div>
        
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <a href="https://www3.nhk.or.jp/nhkworld/en/learnjapanese/">
                      <img src="/images/download.png" alt="NHK World" className="w-full h-64 object-cover rounded-md mb-4"/>
                    </a>
                    <h3 className="text-xl font-semibold mb-2">
                      <a href="https://www3.nhk.or.jp/nhkworld/en/learnjapanese/" className="text-blue-500 hover:underline">
                        NHKWorld Learn Japanese
                      </a>
                    </h3>
                  </div>
        
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <a href="https://matcha-jp.com/easy/">
                      <img src="/images/30-67134.png" alt="Matcha" className="w-full h-64 object-cover rounded-md mb-4"/>
                    </a>
                    <h3 className="text-xl font-semibold mb-2">
                      <a href="https://matcha-jp.com/easy/" className="text-blue-500 hover:underline">
                        Matcha
                      </a>
                    </h3>
                  </div>
                </div>
              </section>
        
              {/* Videos Section */}
              <section className="mb-16">
                <h2 className="text-3xl font-semibold text-primary mb-6 flex items-center">
                  <img src="/images/usanin-favicon.png" width="40" height="40" alt="favicon" className="mr-3"/> VIDEOS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <iframe width="100%" height="200" src="https://www.youtube.com/embed/ZmoBCus_IhQ" frameBorder="0" allowFullScreen className="rounded-md mb-4"></iframe>
                    <h3 className="text-xl font-semibold mb-2">Onomappu</h3>
                  </div>
        
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <iframe width="100%" height="200" src="https://www.youtube.com/embed/J78j99MMq8k" frameBorder="0" allowFullScreen className="rounded-md mb-4"></iframe>
                    <h3 className="text-xl font-semibold mb-2">Japanese Ammo with Misa</h3>
                  </div>
        
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <iframe width="100%" height="200" src="https://www.youtube.com/embed/9903wxInbYw" frameBorder="0" allowFullScreen className="rounded-md mb-4"></iframe>
                    <h3 className="text-xl font-semibold mb-2">三本塾 - Sambon Juku</h3>
                  </div>
                </div>
              </section>
        
            </div>
          </main>
        
          )}
        </div>
      </div>
    </>
  );
};

export default Resources;
