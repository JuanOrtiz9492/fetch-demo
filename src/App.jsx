import { useEffect, useState, } from 'react'
import './App.css'
import axiosInstance from './api';
import Summary from './component/Sumary';
import Carousel from './component/Carousel';


/**
 * 1. Fix Issues on Carrousel
 * 2. every card on Carrousel must have image
 * 3. the image must come from the api
 * you can use UseEffect or UseState to solve the issues on the project
 */

function App() {
  const [pokeList, setPokeList] = useState([])
  const [selectedPoke, setSelectedPoke] = useState({})
  const [page, setPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(()=>{
    const fetchData = async ()=> {
      const data = await axiosInstance.get(`/pokemon?limit=6&offset=${page}`);
      setPokeList(data.data.results)
    }
    fetchData()
  },[])

  useEffect(() => {
    async function fetchData() {
      const updatedPokemonData = await Promise.all(pokeList.map(async (pokemon) => {
        const { data } = await axiosInstance.get(pokemon.url);
        const img = data.sprites.front_default;
        const stats = data.stats;
        return {
          name: pokemon.name,
          img,
          stats,
          onClick: () => setSelectedPoke({img: img, stats:stats})
        };
      }));
      setPokemonData(updatedPokemonData);
    }
    
    fetchData();
  }, [pokeList]);

  const onNextPage = async()=> {
    setPage(page + 1);
    const data = await axiosInstance.get(`/pokemon?limit=6&offset=${page}`);
    setPokeList(data.data.results)
  }
  const onPrevPage = async()=> {
    setPage(page - 1);
    const data = await axiosInstance.get(`/pokemon?limit=6&offset=${page}`);
    setPokeList(data.data.results)
  
  }
  return (
    <div className={`flex flex-col w-full h-screen items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
      <button className='ml-auto' onClick={()=> setIsDarkMode(!isDarkMode)}>
        {<img width="35px" height="35px" src={ isDarkMode ? '/sun.svg' : '/moon.svg'}></img>}
      </button>
      <h1 className={`mb-5 text-3xl font-bold uppercase ${isDarkMode? 'text-white': 'text-black' }`}> PokeDex</h1>
      <Carousel onLeftClick={onPrevPage} onRightClick={onNextPage} elementList={pokemonData} page={page-1}/>
      <div>
        {Object.keys(selectedPoke).length > 0 && <Summary data={selectedPoke}/>}
      </div>
    </div>
  )
}

export default App
