import { useEffect, useState, } from 'react'
import './App.css'
import axiosInstance from './api';
import Summary from './component/Sumary';
import Carousel from './component/Carousel';
import Spinner from './component/spinner';


function App() {
  const [pokeList, setPokeList] = useState([])
  const [selectedPoke, setSelectedPoke] = useState({})
  const [page, setPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const[maxPages, setMaxPages] = useState(1)
  const [pokeImages, setPokeImages] = useState([]);


  const LIMIT = 6;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await axiosInstance.get(`/pokemon?limit=${LIMIT}&offset=0`);
      setPokeList(data.data.results)
      setMaxPages(data.count/LIMIT)
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchImages = async () => {
      const images = await Promise.all(
        pokeList.map(async (pokemon) => {
          const response = await axiosInstance.get(pokemon.url);
          return response.data.sprites.front_default;
        })
      );
      setPokeImages(images);
    };

    fetchImages();
  }, [pokeList]);

  const getInfo = async (url) => {
    const data = await axiosInstance.get(url)
    setSelectedPoke({ img: data.data.sprites.front_default, stats: data.data.stats })
  }
  const getPokemonList = () => {
    return pokeList.map((pokemon,index) => {

      return {
        name: pokemon.name,
        img: pokeImages[index],
        onClick: () => getInfo(pokemon.url)
      };
    });
  };

  const onNextPage = async () => {
    setLoading(true)
    setPage((currentPage) => currentPage + 1);
    const data = await axiosInstance.get(`/pokemon?limit=6&offset=${page}`);
    setPokeList(data.data.results)
    setLoading(false)
  }

  const onPrevPage = async () => {
    if (page > 1) {
      setLoading(true)
      setPage(page - 1);
      const data = await axiosInstance.get(`/pokemon?limit=6&offset=${page}`);
      setPokeList(data.data.results)
      setLoading(false)
    }

  }
  return (
    <div className={`flex flex-col w-full h-screen items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
      <button className='ml-auto' onClick={() => setIsDarkMode(!isDarkMode)}>
        {<img width="35px" height="35px" src={isDarkMode ? '/sun.svg' : '/moon.svg'}></img>}
      </button>
      <h1 className={`mb-5 text-3xl font-bold uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}> PokeDex</h1>
      {loading ? <Spinner /> : <Carousel onLeftClick={onPrevPage} isFirstPage={page===1} onRightClick={onNextPage} isLastPage={page===maxPages} elementList={getPokemonList()} />}
      <div>
        {Object.keys(selectedPoke).length > 0 && <Summary data={selectedPoke} />}
      </div>
    </div>
  )
}

export default App
