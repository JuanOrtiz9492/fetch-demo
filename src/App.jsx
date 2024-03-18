import { useEffect, useState } from 'react';
import './App.css';
import axiosInstance from './api';
import Summary from './component/Sumary';
import Carousel from './component/Carousel';
function App() {
  const [pokeList, setPokeList] = useState([]);
  const [selectedPoke, setSelectedPoke] = useState({});
  const [page, setPage] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const data = await axiosInstance.get(`/pokemon?limit=6&offset=${page * 6}`);
      setPokeList(data.data.results);
    };
    fetchData();
  }, [page]);
  const getInfo = async (url) => {
    const response = await axiosInstance.get(url);
    setSelectedPoke({
      img: response.data.sprites.front_default,
      stats: response.data.stats
    });
  };
  const onNextPage = () => {
    setPage(page + 1);
  };
  const onPrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };
  const getPokemonList = () => {
    return pokeList.map((pokemon) => {
      return {
        name: pokemon.name,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`,onClick: () => getInfo(pokemon.url)
      };
    });
  };
  return (
    <div className={`flex flex-col w-full h-screen items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
      <button className='ml-auto' onClick={() => setIsDarkMode(!isDarkMode)}>
        <img width="35px" height="35px" src={isDarkMode ? '/sun.svg' : '/moon.svg'} alt="Toggle dark mode" />
      </button>
      <h1 className={`mb-5 text-3xl font-bold uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>PokeDex</h1>
      <Carousel onLeftClick={onPrevPage} onRightClick={onNextPage} elementList={getPokemonList()} />
      <div>
        {Object.keys(selectedPoke).length > 0 && <Summary data={selectedPoke} />}
      </div>
    </div>
  );
}
export default App
