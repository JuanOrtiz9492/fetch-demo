import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Card = ({ name, onClick }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setImageUrl(data.sprites.front_default);
    };
    fetchData();
  }, [name]);

  return (
    <div className="shadow-xl w-56 h-48 rounded-md bg-slate-100 flex flex-col p-4 cursor-pointer m-4" onClick={onClick}>
      <div>
        <img src={imageUrl} alt={name}></img>
      </div>
      <div>
        <p>{name}</p>
      </div>
    </div>
  );
};

Card.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

export default Card;