import React, { useState } from "react";
import Modal from "react-modal";
import "./listItem.css";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
Modal.setAppElement("body");
const ListItem = ({ mov }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleImageClick = () => {
    setIsModalOpen(true);
  };
  const [thumbsUpSelected, setThumbsUpSelected] = useState(false);
  const [thumbsDownSelected, setThumbsDownSelected] = useState(false);
  const [duration, setDuration] = useState(0);
  let hours = Math.floor(duration / 3600);
  let minutes = Math.floor((duration % 3600) / 60);
  let seconds = Math.floor(duration % 60);

  const handleThumbsUpClick = () => {
    setThumbsUpSelected(true);
    setThumbsDownSelected(false);
  };

  const handleThumbsDownClick = () => {
    setThumbsDownSelected(true);
    setThumbsUpSelected(false);
  };

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
                width:  "60%",
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
                <source
                  src={mov.video}
                  type="video/mp4"
                />
              </video>

              <div className="movieinfo">
                <p className="duration">{`${hours} hour ${minutes} min ${seconds} sec`}</p>
                <h2 className="titlemov">{mov.title}</h2>
                <p className="desc">{mov.desc}</p>
                <div className="rating">
                  <div className="thumbscon">
                    <span className="ratetxt">Rate</span>
                    <FontAwesomeIcon
                      className="thumbs"
                      icon={faThumbsUp}
                      style={{ color: thumbsUpSelected ? "white" : "" }}
                      onClick={handleThumbsUpClick}
                    />
                    <FontAwesomeIcon
                      className="thumbs"
                      icon={faThumbsDown}
                      style={{ color: thumbsDownSelected ? "white" : "" }}
                      onClick={handleThumbsDownClick}
                    />
                  </div>
                </div>
              </div>
            </>
          </Modal>
        </div>
      )}
    </>
  );
};

export default ListItem;
