import React, { useRef, useState, useEffect } from "react";
import "./List.css";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import ListItem from "../List/listItem/ListItem"

const List = () => {
  const { allmovie } = useContext(MyContext);
  const [slideNumber, setSlideNumber] = useState(0);

  const listref = useRef();
  const leftIconRef = useRef();
  const rightIconRef = useRef();

  useEffect(() => {
    // Add event listeners for better performance handling
    const handleResize = () => {
      if (listref.current) {
        const distance = listref.current.getBoundingClientRect().x - 50;
        listref.current.style.transform = `translateX(${-300 * slideNumber + distance}px)`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [slideNumber]);

  function handleclick(direction) {
    let distance = listref.current.getBoundingClientRect().x - 50;

    if (direction === "left" && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listref.current.style.transform = `translateX(${360 + distance}px)`;
    }
    if (direction === "right" && slideNumber < allmovie.length / 5 - 1) {
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
            style={{ display: slideNumber === 0 ? "none" : "block" }}
          />

          <div className="listcontainer" ref={listref}>
            {allmovie.length > 0 && (
              <div className="movielist">
                <span className="listTitle">All Movies</span>
                <div className="wrapper">
                  <div className="listcontainer">
                    {allmovie.map((movie) => (
                      <ListItem key={movie.id} mov={movie} />
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
            style={{ display: slideNumber === allmovie.length / 5 - 1 ? "none" : "block" }}
          />
        </div>
      </div>
    </>
  );
};

export default List;
