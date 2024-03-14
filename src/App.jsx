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
  const pokemonsPerPage = 10
  const [pokeList, setPokeList] = useState([])
  const [selectedPoke, setSelectedPoke] = useState({})
  const [page, setPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
  console.log("Page changed to", page);
  
  (async () => {
    try {
      const response = await axiosInstance.get(`/pokemon?offset=${(page - 1) * pokemonsPerPage}&limit=${pokemonsPerPage}`);
      const pokelistData = await fetchAndAddImgUrls(response.data.results);
      setPokeList(pokelistData);
    } catch (error) {
      console.error('Error fetching pokemons information:', error);
    }
  })();

  }, [page]);

  // Function to fetch image data from URLs
  const fetchAndAddImgUrls = async (pokelistInfo) => {
    return Promise.all(
      pokelistInfo.map(async (pokemon) => {
        const { data } = await axiosInstance.get(pokemon.url);
        return { name: pokemon.name, url: pokemon.url, img_url: data.sprites.front_default };
      })
    );
  };

  const getInfo = async (url)=> {
    const data = await axiosInstance.get(url)
    setSelectedPoke({img: data.data.sprites.front_default, stats:data.data.stats})
  }

  const getPokemonList = ()=> {
    return pokeList.map((pokemon)=>{
      return {
        name: pokemon.name,
        img: pokemon.img_url,
        onClick: ()=> getInfo(pokemon.url)
      }
    })
  }
  const onNextPage = async()=> {
    setPage((prev) => prev + 1);
  }
  const onPrevPage = async()=> {
    if (page > 1) setPage((prev) => prev - 1);
  }
  return (
    <div className={`flex flex-col w-full h-screen items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
      <button className='ml-auto' onClick={()=> setIsDarkMode(!isDarkMode)}>
        {<img width="35px" height="35px" src={ isDarkMode ? '/sun.svg' : '/moon.svg'}></img>}
      </button>
      <h1 className={`mb-5 text-3xl font-bold uppercase ${isDarkMode? 'text-white': 'text-black' }`}>PokeDex</h1>
      <p>Page:{page}</p>
      <Carousel onLeftClick={onPrevPage} onRightClick={onNextPage} elementList={getPokemonList()}/>
      <div>
        {Object.keys(selectedPoke).length > 0 && <Summary data={selectedPoke}/>}
      </div>
    </div>
  )
}

export default App
