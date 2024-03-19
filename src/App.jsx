import { useEffect, useState } from "react";
import "./App.css";
import axiosInstance from "./api";
import Summary from "./component/Sumary";
import Carousel from "./component/Carousel";

/**
 * DONE 1. Fix Issues on Carrousel
 * DONE 2. every card on Carrousel must have image
 * DONE 3. the image must come from the api
 * you can use UseEffect or UseState to solve the issues on the project
 */

/*+
  REFERENCES
  https://pokeapi.co/docs/v2#pokemon - API Documentation
  https://www.freecodecamp.org/espanol/news/como-usar-async-await-para-escribir-un-codigo-mejor-en-javascript/

*/

const POKEMON_PER_PAGE = 6;

function App() {
  const [pokeList, setPokeList] = useState([]);
  const [selectedPoke, setSelectedPoke] = useState({});
  const [page, setPage] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axiosInstance.get("/pokemon?limit=6&offset=`${page}`");
      pokeBetterData(data.data.results);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPageData = async () => {
      const data = await axiosInstance.get(
        // 6 is the limit of pokemon per page. So, we need to multiply the page number by 6 to get the next page pokemons
        `/pokemon?limit=6&offset=${page * POKEMON_PER_PAGE}`
      );
      pokeBetterData(data.data.results);
    };
    fetchPageData();
  }, [page]);

  const pokeBetterData = async (data) => {
    const pokemonData = [];
    for (const pokemon of data) {
      try {
        const response = await axiosInstance.get(pokemon.url);
        pokemonData.push({
          name: pokemon.name,
          img: response.data.sprites.front_default,
          url: pokemon.url,
          stats: response.data.stats,
        });
      } catch (error) {
        console.error(error);
      }
    }
    setPokeList(pokemonData);
  };

  const getPokemonList = () => {
    return pokeList.map((pokemon) => {
      return {
        name: pokemon.name,
        img: pokemon.img,
        onClick: () => getInfo(pokemon),
      };
    });
  };

  const getInfo = (poke) => {
    setSelectedPoke({
      img: poke.img,
      stats: poke.stats,
    });
  };

  const onNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const onPrevPage = () => {
    setPage((prev) => prev - 1);
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
        // Only allow to go back if the page is greater than 0 (have pokemons to show)
        onLeftClick={page > 0 ? onPrevPage : null}
        onRightClick={onNextPage}
        elementList={getPokemonList()}
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
