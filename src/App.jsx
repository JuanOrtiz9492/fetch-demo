import { useEffect, useRef, useState } from "react";
import "./App.css";
import axiosInstance from "./api";
import Summary from "./component/Sumary";
import Carousel from "./component/Carousel";

const LIMIT = 4;

function App() {
  const [pokeList, setPokeList] = useState([]);
  const [selectedPoke, setSelectedPoke] = useState({});
  const [page, setPage] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const maxOffset = useRef(0);

  useEffect(() => {
    const fetchData = async () => {

      const { data } = await axiosInstance.get(
        `/pokemon?limit=${LIMIT}&offset=${page}`
      );
      maxOffset.current = data.count;
      const pokemons = data.results;
      const promises = [];

      pokemons.forEach((e) => {
        promises.push(getInfo(e.url));
      });

      const fullPokemons = await Promise.all(promises);

      fullPokemons.forEach((el, indx) => {
        el.name = pokemons[indx].name;
        el.onClick = () => setSelectedPoke({ img: el.img, stats: el.stats });
      });

      setPokeList(fullPokemons);
    };
    fetchData();
  }, [page]);

  const getInfo = async (url) => {
    const data = await axiosInstance.get(url);
    return {
      img: data.data.sprites.front_default,
      stats: data.data.stats,
    };
  };

  const doesNextPageExists = (current) => {
    return current + LIMIT <= maxOffset.current;
  };

  const doesPrevPageExists = (current) => {
    return current >= LIMIT;
  };

  const onNextPage = async () => {
    setPage((prev) => {
      if (doesNextPageExists(prev)) return prev + LIMIT;
      return prev;
    });
  };

  const onPrevPage = async () => {
    setPage((prev) => {
      if (doesPrevPageExists(prev)) return prev - LIMIT;
      return prev;
    });
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
        elementList={pokeList}
        nextPageExits={doesNextPageExists(page)}
        prevPageExists={doesPrevPageExists(page)}
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
