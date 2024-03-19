import Card from "./Card"
const Carousel = ({ onLeftClick, onRightClick, elementList = [], isFirstPage, isLastPage }) => {
    return (
        <div className="flex w-full justify-center items-center">
            {!isFirstPage && <button onClick={onLeftClick} className="border-t-4 border-l-4 border-gray-300 w-8 h-8 -rotate-45"></button>}
            <div className="w-full h-auto flex flex-wrap">
                {elementList.map((element) => (
                    <Card key={element.name} img={element.img} name={element.name} onClick={element.onClick} />
                ))}
            </div>
            {!isLastPage && <button onClick={onRightClick} className="border-t-4 border-r-4 border-gray-300 w-8 h-8 rotate-45"> </button>}        </div>
    )
}

export default Carousel