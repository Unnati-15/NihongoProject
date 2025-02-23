import BeginnerNavbar from "./BeginnerNavbar";


const HiraganaLearning = () => {
  return (
    <>
    <BeginnerNavbar/>
    <div className="min-h-screen bg-gray-100 py-12 px-6 mb-12">

      {/* Hiragana Learning Section */}
      <div className="exams2 bg-white shadow-lg rounded-xl overflow-hidden mb-10">
        {/* <img 
          src="/images/series.jpg" 
          alt="aeiou" 
          className="w-full h-72 object-cover rounded-t-xl" 
        /> */}
        <div className="text-center p-6">
          <h2 className="examsh1 text-3xl font-semibold text-primary mb-4">LET US LEARN HIRAGANA</h2>
          <img 
            src="/images/preview-hiraganachart-dots-green.jpg" 
            alt="hiraganachart" 
            className="imgex2 mx-auto w-4/5 md:w-3/5 rounded-lg shadow-md" 
          />
        </div>
      </div>

      {/* Video Section */}
      <div className="exams3 text-center mb-10">
        <h2 className="examsh2 text-2xl font-semibold text-primary mb-6">VIDEO CLIP FOR LEARNING HIRAGANA</h2>
        <div className="video-iframe mx-auto max-w-4xl">
          <iframe 
            width="100%" 
            height="315" 
            src="https://www.youtube.com/embed/wD3FJgij79c" 
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div>

    

    </div></>
  );
};

export default HiraganaLearning;
