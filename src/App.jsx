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
    const pokemonData = response.data;
    setSelectedPoke({
      img: pokemonData.sprites.front_default,
      stats: pokemonData.stats
    });
  };

  useEffect(() => {
    const loadPokemonList = async () => {
      const pokemonList = await getPokemonList();
      setPokeList(pokemonList);
    };
    loadPokemonList();
  }, [page]);

  const getPokemonList = async () => {
    try {
      const data = await axiosInstance.get(`/pokemon?limit=6&offset=${page * 6}`);
      const pokemonList = data.data.results;
      const pokemonData = await Promise.all(pokemonList.map(async (pokemon) => {
        const response = await axiosInstance.get(pokemon.url);
        const imgUrl = response.data.sprites.front_default;
        return {
          name: pokemon.name,
          img: imgUrl,
          onClick: () => getInfo(pokemon.url)
        };
      }));
      return pokemonData;
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      return [];
    }
  };
  

  const onNextPage = () => {
    setPage(page + 1);
  };

  const onPrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div className={`flex flex-col w-full h-screen items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
      <button className='ml-auto' onClick={() => setIsDarkMode(!isDarkMode)}>
        <img width="35px" height="35px" src={isDarkMode ? '/sun.svg' : '/moon.svg'} alt="Toggle dark mode" />
      </button>
      <h1 className={`mb-5 text-3xl font-bold uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>PokeDex</h1>
      <Carousel onLeftClick={onPrevPage} onRightClick={onNextPage} elementList={pokeList} />
      <div>
        {Object.keys(selectedPoke).length > 0 && <Summary data={selectedPoke} />}
      </div>
    </div>
  );
}

export default App;
