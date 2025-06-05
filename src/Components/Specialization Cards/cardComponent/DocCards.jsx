import { useNavigate } from 'react-router-dom';

const DocCards = ({ h1, src, p }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/doctors/${encodeURIComponent(h1)}`);
  };

  return (
    <>
     <section className="flex flex-col w-80 h-80 bg-white hover:shadow-lg border-2 border-green-500 rounded-2xl p-4 m-4 transition-transform duration-200 hover:scale-105 cursor-pointer animate-fade-in" onClick={handleClick}>
        <h1 className="text-2xl font-bold mb-4 text-green-700">{h1}</h1>
        <div className="flex justify-center border-2 border-green-100 rounded-xl overflow-hidden mb-2">
        <img src={src} alt="Doctor" className="w-40 h-40 object-cover" />
        </div>
        <div>
          <p className="pt-4 text-gray-600">{p}</p>
        </div>
      </section>
    </>
  );
};

export default DocCards;
