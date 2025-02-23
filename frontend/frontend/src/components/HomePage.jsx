import {Link} from 'react-router-dom';

const HomePage = () => {

  return (
    <main>
      <div className="container mx-auto mb-12 ">
  <div className="text-center">
    <a href="phrases">
      <img src="/images/japanese.jpg" alt="japanese" id="img1" className="block mx-auto mt-2 mb-10 w-[9000px] h-[400px] rounded-lg  "  />
    </a>
  </div>
  
  <div className="text-center mb-8 text-2xl">
    <p className=" font-semibold p-4 text-2xl">
      Looking for something which can help you learn Japanese Language easily ..? <br />
      Wondering where to start? How to start? <br />
      <img src="/images/images.jfif" alt="wondering" className="rounded-xl shadow-xl w-60 mx-auto mt-4" />
    </p>
    <p className="font-semibold text-2xl">
      Then Click Here To Get Started: <span className="text-green-500">→</span>
     
        <button className="btn btn-primary mt-4 text-2xl"><Link
          to="/phrases" className="text-2xl">GET STARTED</Link></button>
      
    </p>
  </div>
  
  <div className="text-center mb-8">
    <p className="text-2xl font-medium">
      Japanese is written mostly using three writing scripts - kanji, hiragana, and katakana.
    </p>
  </div>

  <div className="max-h-[500px] overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
  <div className="card shadow-xl bg-base-100 p-4 mb-16">
    <Link to="/hiragana">
      <img src="/images/hiragana.png" alt="hiragana-a" className="rounded-lg mb-4 w-60" />
    </Link>
    <h2 className="text-2xl font-semibold">HIRAGANA</h2>
    <p className="text-base">
      Hiragana (ひらがな) is a Japanese syllabary, part of the Japanese writing system, along with katakana as well as kanji. It is a phonetic lettering system. The word hiragana literally means flowing or simple kana, originally as contrasted with kanji. Hiragana is used to write okurigana (kana suffixes following a kanji root, for example to inflect verbs and adjectives), various grammatical and function words including particles, as well as miscellaneous other native words for which there are no kanji or whose kanji form is obscure or too formal for the writing purpose.
    </p>
  </div>

  <div className="card shadow-xl bg-base-100 p-4">
  <Link to="/katakana">
      <img src="/images/katakana.png" alt="katakana-a" className="rounded-lg mb-4 w-60" />
    </Link>
    <h2 className="text-2xl font-semibold">KATAKANA</h2>
    <p className="text-base">
      Katakana (カタカナ) is a Japanese syllabary, one component of the Japanese writing system along with hiragana, kanji and in some cases the Latin script (known as rōmaji). The word katakana means fragmentary kana, as the katakana characters are derived from components or fragments of more complex kanji. The katakana syllabary is used for transcription of foreign-language words into Japanese and the writing of loan words for emphasis; to represent onomatopoeia; for technical and scientific terms; and for names of plants, animals, minerals and often Japanese companies.
    </p>
  </div>

  <div className="card shadow-xl bg-base-100 p-4">
    <Link to='/kanji'>
      <img src="/images/kanji.png" alt="kanji-a" className="rounded-lg mb-4 " />
    </Link>
    <h2 className="text-2xl font-semibold">KANJI</h2>
    <p className="text-base">
      Kanji (漢字) are logographic characters (based on the traditional ones) taken from the Chinese script and used in the writing of Japanese. They were made a major part of the Japanese writing system during the time of Old Japanese, and are still used, along with the natively derived syllabic scripts of hiragana and katakana. Starting in the 1920s, the Japanese government has published character lists periodically to help direct the education of its citizenry through the myriad Chinese characters that exist. There are nearly 3,000 kanji used in Japanese names and in common communication.
    </p>
  </div>
</div>


</div>

    </main>
  );
}

export default HomePage;
