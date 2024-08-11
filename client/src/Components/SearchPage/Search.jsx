import "../List/listItem/listItem.css";
import React, { useState } from "react";
import Modal from "react-modal";
import "./Search.css";
import { MyContext } from "../../ContextApi/MyContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

Modal.setAppElement("body");

const Search = () => {
  const { searchresult, setsearchresult,loading  } = useContext(MyContext);



  return (
    <>

      { !loading && searchresult.length > 0 ? (
        <div>
          <Link to={"/"} 
          onClick={()=>setsearchresult([])} 
          className="backtohome"
          >
            Back to Home
          </Link>
          <div className="movielist ">
            <span className="listTitle Search">Searched Movies</span>
            <br />
            <div className="wrapper wraper-search">
              <div className="listcontainer">
                {searchresult.map((movie, index) => (
                  <SearchItem key={index} mov={movie} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : loading ? <h1> Loading .... </h1> :
        <div>
            <Link to={"/"} 
          onClick={()=>setsearchresult([])} 
          className="backtohome"
          >
            Back to Home
          </Link>
          <h1>Result Not Found</h1>
        </div>
      }
    </>
  );
};

export default Search;

export const SearchItem = ({ mov }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleImageClick = () => {
    setIsModalOpen(true);
  };
  const [duration, setDuration] = useState(0);
  let hours = Math.floor(duration / 3600);
  let minutes = Math.floor((duration % 3600) / 60);
  let seconds = Math.floor(duration % 60);


  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  return (
    <>
      {mov && (
        <div className="listItem">
          <img
            src={mov.image}
            alt={`List item ${mov.title}`}
            className="listimg"
            onClick={handleImageClick}
          />
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.75)",
              },
              content: {
                backgroundColor: "#1b1b1b",
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                height: "100%",
                width: "60%",
                zIndex: 1111,
              },
            }}
          >
            <>
              <video
                className={"videop"}
                controls
                onLoadedMetadata={handleLoadedMetadata}
              >
                <source src={mov.video} type="video/mp4" />
              </video>

              <div className="movieinfo">
                <p className="duration">{`${hours} hour ${minutes} min ${seconds} sec`}</p>
                <h2 className="titlemov">{mov.title}</h2>
                <p className="rating ">{mov.desc}</p>
                <p
                  className="ratinglimit"
                >
                  Rating: <span>{mov.limit}</span>{" "}
                </p>
              </div>
            </>
          </Modal>
        </div>
      )}
    </>
  );
};
