import BeginnerNavbar from "./BeginnerNavbar";

const KanjiLearning = () => {
  return (
    <>
      <BeginnerNavbar />
      <div className="min-h-screen bg-gray-50 py-12 px-6 mb-12">

        {/* Kanji Learning Section */}
        <div className="exams2 text-center mb-12">
          <h2 className="text-3xl font-semibold text-primary mb-4">LET US MAKE KANJI LEARNING EASY</h2>
          <img 
            src="/images/kanjiimg.webp" 
            alt="kanjichart" 
            className="imgkanji mx-auto w-10 md:w-3/5 rounded-lg shadow-lg"
          />
        </div>

        {/* Video Section */}
        <div className="text-center mb-12">
          <p className="exams1p text-xl font-light mb-6">
            To get the basic idea of kanjis, please go through the recommended video below : &#8595;
          </p>
          <iframe 
            width="100%" 
            height="315" 
            src="https://www.youtube.com/embed/AtwD31VPI1c" 
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>

        {/* Resource Links Section */}
        <div className="space-y-12 mt-10">
          
          {/* Kanshudo */}
          <div className="row1 flex flex-col md:flex-row items-center justify-between bg-white shadow-lg overflow-hidden p-6 mb-12">
            <div className="column side mb-6 md:mb-0">
              <a href="https://www.kanshudo.com/how-to-master-the-kanji">
                <img 
                  src="/images/Kanshudo.jpg" 
                  alt="kanshudo" 
                  className="imga w-48 h-50 object-cover rounded-lg border-2 border-primary"
                />
              </a>
            </div>
            <div className="column middle w-full md:w-3/5">
              <a href="https://www.kanshudo.com/how-to-master-the-kanji">
                <h2 className="text-2xl font-semibold text-primary mb-2">KANSHUDO</h2>
              </a>
              <p className="text-lg text-gray-700">This is a site where you can learn Japanese comprehensively with tremendous content and manage your learning progress with Kanshudo AI.</p>
            </div>
          </div>

          {/* Jisho */}
          <div className="row1 flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-xl overflow-hidden p-6 mb-12">
            <div className="column side mb-6 md:mb-0">
              <a href="https://jisho.org/">
                <img 
                  src="/images/jisho.png" 
                  alt="jisho" 
                  className="imga w-100 h-32 object-cover rounded-lg border-2 border-primary"
                />
              </a>
            </div>
            <div className="column middle w-full md:w-3/5">
              <a href="https://jisho.org/">
                <h2 className="text-2xl font-semibold text-primary mb-2">JISHO</h2>
              </a>
              <p className="text-lg text-gray-700">Jisho is a powerful Japanese-English dictionary. It lets you find words, kanji, example sentences, and more quickly and easily.</p>
            </div>
          </div>

          {/* Marugoto Plus */}
          <div className="row1 flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-xl overflow-hidden p-6 mb-12">
            <div className="column side mb-6 md:mb-0">
              <a href="https://a1.marugotoweb.jp/en/kanji.php">
                <img 
                  src="/images/img_beginner_active01.gif" 
                  alt="Marugoto" 
                  className="imga w-48 h-50 object-cover rounded-lg border-2 border-primary"
                />
              </a>
            </div>
            <div className="column middle w-full md:w-3/5">
              <a href="https://a1.marugotoweb.jp/en/kanji.php">
                <h2 className="text-2xl font-semibold text-primary mb-2">MARUGOTO PLUS</h2>
              </a>
              <p className="text-lg text-gray-700">MARUGOTO Plus is a website where users can learn about Japanese language and culture alongside the contents of Marugoto: Japanese Language and Culture.</p>
            </div>
          </div>

          {/* Kanji Dictionary */}
          <div className="row1 flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-xl overflow-hidden p-6 mb-12">
            <div className="column side mb-6 md:mb-0">
              <a href="https://jitenon.com/">
                <img 
                  src="/images/dictionary.png" 
                  alt="dictionary" 
                  className="imga w-400 h-32 object-cover rounded-lg border-2 border-primary"
                />
              </a>
            </div>
            <div className="column middle w-full md:w-3/5">
              <a href="https://jitenon.com/">
                <h2 className="text-2xl font-semibold text-primary mb-2">KANJI DICTIONARY</h2>
              </a>
              <p className="text-lg text-gray-700">A kanji dictionary to look up kanji and words. It has lots of characters and a wealth of information.</p>
            </div>
          </div>

          {/* Tofugu */}
          <div className="row1 flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-xl overflow-hidden p-6 mb-12">
            <div className="column side mb-6 md:mb-0">
              <a href="https://www.tofugu.com/japanese/kanji-radicals-mnemonic-method/">
                <img 
                  src="/images/download.png" 
                  alt="tofugu" 
                  className="imga w-58 h-40 object-cover rounded-lg border-2 border-primary"
                />
              </a>
            </div>
            <div className="column middle w-full md:w-3/5">
              <a href="https://www.tofugu.com/japanese/kanji-radicals-mnemonic-method/">
                <h2 className="text-2xl font-semibold text-primary mb-2">TOFUGU</h2>
              </a>
              <p className="text-lg text-gray-700">This is where you can learn different radicals used in writing kanjis.</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default KanjiLearning;
