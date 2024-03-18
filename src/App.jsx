import { useEffect, useState } from "react";
import "./App.css";
import axiosInstance from "./api";
import Summary from "./component/Sumary";
import Carousel from "./component/Carousel";

/**
 * 1. Fix Issues on Carrousel
 * 2. every card on Carrousel must have image
 * 3. the image must come from the api
 * you can use UseEffect or UseState to solve the issues on the project
 */

function App() {
  const [pokeList, setPokeList] = useState([]);
  const [selectedPoke, setSelectedPoke] = useState({});
  const [page, setPage] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [elementList, setElementList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axiosInstance.get("/pokemon?limit=6&offset=0");
      setPokeList(data.data.results);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchNewList = async () => {
      const newList = await getPokemonList();
      
      console.log("useEffect", newList[0]);
      
      setElementList(newList);
    };
    fetchNewList();
    
  }, [pokeList]);
  console.log("element", elementList);
  
  const getInfo = async (url) => {
    const data = await axiosInstance.get(url);
    setSelectedPoke({
      img: data.data.sprites.front_default,
      stats: data.data.stats,
    });
  };

  const getPokemonList = async () => {
    try{
        const newList = await Promise.all(
          pokeList.map(async (pokemon) => {
            const response = await axiosInstance.get(pokemon.url);
            const img = response.data.sprites.front_default;
            return {
              name: pokemon.name,
              img: img || "/whos.jpg",
              onClick: () => getInfo(pokemon.url),
            };
          })
        );
        console.log("Update list", newList);
        return newList;
    }catch(e) {
      console.error("Errro new list", e);
    }
  };

  const onNextPage = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const data = await axiosInstance.get(
      `/pokemon?limit=6&offset=${nextPage * 6}`
    );
    setPokeList(data.data.results);
  };
  const onPrevPage = async () => {
    if (page > 0) {
      const prevPage = page - 1;
      setPage(prevPage);
      const data = await axiosInstance.get(
        `/pokemon?limit=6&offset=${prevPage * 6}`
      );
      setPokeList(data.data.results);
    }
  };


  return (
    <div
      className={`flex flex-col w-full h-screen items-center ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-8`}
    >
      <button className="ml-auto" onClick={() => setIsDarkMode(!isDarkMode)}>
        {
          <img
            width="35px"
            height="35px"
            src={isDarkMode ? "/sun.svg" : "/moon.svg"}
          ></img>
        }
      </button>
      <h1
        className={`mb-5 text-3xl font-bold uppercase ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {" "}
        PokeDex
      </h1>
      <Carousel
        onLeftClick={onPrevPage}
        onRightClick={onNextPage}
        elementList={elementList}
      />
      <div>
        {Object.keys(selectedPoke).length > 0 && (
          <Summary data={selectedPoke} />
        )}
      </div>
    </div>
  );
}

export default App;
