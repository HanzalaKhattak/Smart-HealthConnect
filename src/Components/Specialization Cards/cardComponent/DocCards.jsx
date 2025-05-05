
import { useNavigate } from 'react-router-dom';

const DocCards = ({ h1, src, p }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/doctors/${encodeURIComponent(h1)}`);
  };

  return (
    <>
     <section className='flex flex-col w-80 h-80 bg-white hover:shadow-md border-1 border-green-500 rounded-lg p-4 m-4' onClick={handleClick}>
        <h1 className='text-2xl font-bold mb-4'>{h1}</h1>
        <div className='flex justify-center border-1 border-green-500'>
        <img src={src} alt="Doctor" className='w-40 h-40' />
        </div>
        <div>
          <p className='pt-4'>{p}</p>
        </div>
      </section>
    </>
  );
};

export default DocCards;
