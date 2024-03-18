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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [pokeImg, setPokeImg] = useState([])

  // poner maximo de pokemones para definir el total de pages
  useEffect(()=>{
    const fetchData = async ()=> {
      const data = await axiosInstance.get('/pokemon?limit=6&offset=0');
      setTotalPages((data.data.count / 6) - 1)
    }
    fetchData()
  },[])
  // cada que se modifique page, para cambiar correctamente
  useEffect(()=>{
    const fetchData = async ()=> {
      const data = await axiosInstance.get(`/pokemon?limit=6&offset=${page*6}`);
      setPokeList(data.data.results)
    }
    fetchData()
  },[page])
  // Cada que se modifique la pokeList asignar pokeImg
  useEffect(()=>{
    const fetchImagenes = async ()=> {
      const pokeImg = await
      Promise.all(
        pokeList.map(async(pokemon) => {
          const response = await  axiosInstance.get(pokemon.url);
          return response.data.sprites.front_default
        })
      );
      setPokeImg(pokeImg)
      setPokeList(data.data.results)
    }
    fetchImagenes()
  },[pokeList]);

  const getInfo = async (url)=> {
    const data = await axiosInstance.get(url)
    setSelectedPoke({img: data.data.sprites.front_default, stats:data.data.stats})
  }
  const getPokemonList = ()=> {
    return pokeList.map((pokemon, img)=>{
      return {
        name: pokemon.name,
        img: pokeImg[img],
        onClick: ()=> getInfo(pokemon.url)
      }
    })
  }

  const onNextPage = async()=> {
    // avanzar page solo si es menor al limite de pages 
    if (page<totalPages) {
      setPage(page + 1);
    }
  }
  const onPrevPage = async()=> {
    // retroceder page solo si la actual es mayor a 0
    if (page>0) {
      setPage(page - 1);
    }
  }


  return (
    <div className={`flex flex-col w-full h-screen items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
      <button className='ml-auto' onClick={()=> setIsDarkMode(!isDarkMode)}>
        {<img width="35px" height="35px" src={ isDarkMode ? '/sun.svg' : '/moon.svg'}></img>}
      </button>
      <h1 className={`mb-5 text-3xl font-bold uppercase ${isDarkMode? 'text-white': 'text-black' }`}> PokeDex</h1>
      <Carousel onLeftClick={onPrevPage} onRightClick={onNextPage} elementList={getPokemonList()}/>
      <div>
        {Object.keys(selectedPoke).length > 0 && <Summary data={selectedPoke}/>}
      </div>
    </div>
  )
}

export default App
