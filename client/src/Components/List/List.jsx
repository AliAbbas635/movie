import React, { useRef, useContext } from "react";
import "./List.css";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MyContext } from "../../ContextApi/MyContext";
import ListItem from "../List/listItem/ListItem";

const List = () => {
  const { allmovie } = useContext(MyContext);
  const listRef = useRef();

  const scroll = (direction) => {
    const { current } = listRef;
    if (direction === "left") {
      current.scrollLeft -= 300; // Adjust the scroll distance as needed
    } else {
      current.scrollLeft += 300; // Adjust the scroll distance as needed
    }
  };

  return (
    <div className="list">
      <h2 className="listTitle">All Movies</h2>
      <div className="wrapper">
        <FontAwesomeIcon
          className="slidarrow left"
          icon={faChevronLeft}
          onClick={() => scroll("left")}
        />
        <div className="listContainer" ref={listRef}>
          {allmovie && allmovie.map((movie) => (
            <ListItem key={movie.id} mov={movie} />
          ))}
        </div>
        <FontAwesomeIcon
          className="slidarrow right"
          icon={faChevronRight}
          onClick={() => scroll("right")}
        />
      </div>
    </div>
  );
};

export default List;
