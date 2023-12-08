import React, { useRef, useState, useMemo } from "react";
import "./List.css";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListItem from "./listItem/ListItem";
import { useContext } from "react";
import { MyContext } from "../../ContextApi/MyContext";

const List = () => {
  const { randomfifty, allmovie } = useContext(MyContext);

  const [slideNumber, setSlideNumber] = useState(0);

  const listref = useRef();
  const leftIconRef = useRef();
  const rightIconRef = useRef();

  const horrorMovies = useMemo(() => {
    if (randomfifty) {
      return randomfifty.filter(movie => movie.gener?.toLowerCase() === "horror");
    }
    return [];
  }, [randomfifty]);
  

  function handleclick(direction) {
    let distance = listref.current.getBoundingClientRect().x - 50;

    if (direction === "left" && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listref.current.style.transform = `translateX(${360 + distance}px)`;
    }
    if (direction === "right" && slideNumber < 6) {
      setSlideNumber(slideNumber + 1);
      listref.current.style.transform = `translateX(${-300 + distance}px)`;
    }
  }

  return (
    <>
      <div className="list">
        <div className="wrapper">
          <FontAwesomeIcon
            className="slidarrow left"
            icon={faChevronLeft}
            ref={leftIconRef}
            onClick={() => handleclick("left")}
            style={{ display: slideNumber === 0 && "none" }}
          />

          <div className="listcontainer" ref={listref}>
            {horrorMovies.length > 0 && (
              <div className="movielist">
                <span className="listTitle">Horror</span>
                <div className="wrapper">
                  <div className="listcontainer">
                    {horrorMovies.map((movie) => (
                      <ListItem key={movie._id} mov={movie} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <FontAwesomeIcon
            className="slidarrow right"
            icon={faChevronRight}
            ref={rightIconRef}
            onClick={() => handleclick("right")}
            style={{ display: slideNumber === 5 && "none" }}
          />
        </div>
      </div>

      {allmovie.length > 0 && (
        <div className="movielist">
          <span className="listTitle">Recommended Movies</span>
          <br />
          <div className="wrapper">
            <div className="listcontainer">
              {allmovie.map((movie) => (
                <ListItem key={movie._id} mov={movie} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
