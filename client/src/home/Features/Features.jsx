import React, { useState } from "react";
import "./Features.css";
import { faCirclePlay, faInfoCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-dropdown/style.css";
import { useContext } from "react";
import { MyContext } from "../../ContextApi/MyContext";

const Features = () => {
  const { randommov } = useContext(MyContext);

  const [showplayer, setshowplayer] = useState(false);
  const [showinfo, setshowinfo] = useState(false);
  function HandlePlay() {
    setshowplayer(true);
  }

  function handBlur() {
    setshowplayer(false);
  }

  function handleinfo() {
    console.log("clik");
    setshowinfo(true);
  }

  function handleinfoblur() {
    console.log("blur");
    setshowinfo(false);
  }

  return (
    <>
      {randommov && (
        <div className="feature">
          <img
            className="featureimg"
            src={randommov.image}
            alt="backgroup"
          />

          <div className="info">
            <span className="imgtitle">{randommov.title}</span>
            <br />
            <div className="buttons">
              <button className="btn"
              onClick={HandlePlay}>
                <FontAwesomeIcon className="icon" icon={faCirclePlay} />
                <span className="btnspan">Play</span>
              </button>
              <button
                onClick={handleinfo}
                onBlur={handleinfoblur}
                className="btn grey"
              >
                <FontAwesomeIcon className="icon" icon={faInfoCircle} />

                <span className="btnspan">Info</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="videocon">
      {showplayer && <FontAwesomeIcon 
        onClick={handBlur}
        className="close " icon={faXmarkCircle} />}

        {showplayer && (
          <video className={"videop"} 
          onBlur={handBlur}
          controls>
            <source src={randommov.video} type="video/mp4" />
          </video>
        )}
      
      </div>

      {showinfo && (
        <div className="infocon">
          <h2 className="movie-name">
            Movie Name: <span className="movie-name-value">{randommov.title}</span>
          </h2>
          <h4 className="description">
            Description:{" "}
            <span className="description-value">
              {randommov.desc}
            </span>
          </h4>
          <h4 className="genre">
            Genre: <span className="genre-value">{randommov.gener}</span>
          </h4>
          <h4 className="rating">
            Rating: <span className="rating-value">{randommov.limit}</span>
          </h4>
        </div>
      )}
    </>
  );
};

export default Features;
