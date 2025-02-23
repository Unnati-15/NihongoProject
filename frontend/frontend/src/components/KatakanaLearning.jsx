import BeginnerNavbar from "./BeginnerNavbar";

const KatakanaLearning = () => {
  return (
    <>
    <BeginnerNavbar/>
    <div className="min-h-screen bg-gray-50 py-12 px-6 mb-12">

      {/* Katakana Learning Section */}
      <div className="exams2 bg-white shadow-lg rounded-xl overflow-hidden mb-10">
        
        <div className="text-center p-6">
          <h2 className="examsh1 text-3xl font-semibold text-primary mb-4">LET US LEARN KATAKANA</h2>
          <img 
            src="/images/katakanaimg.jpg" 
            alt="katakanachart" 
            className="imgex2 mx-auto w-4/5 md:w-3/5 rounded-lg shadow-md" 
          />
        </div>
      </div>

      {/* Video Section */}
      <div className="exams3 text-center mb-10">
        <h2 className="examsh2 text-2xl font-semibold text-primary mb-6">VIDEO CLIP FOR LEARNING KATAKANA</h2>
        <div className="video-iframe mx-auto max-w-4xl">
          <iframe 
            width="100%" 
            height="315" 
            src="https://www.youtube.com/embed/rf-n_qI2occ" 
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div>

    </div></>
  );
};

export default KatakanaLearning;
