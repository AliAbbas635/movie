import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UploadMovie.css";
import { MyContext } from "../ContextApi/MyContext";
import BaseURL from "../BaseURL";
import {toast,ToastContainer}  from "react-toastify"

const UploadMovie = () => {
  const { user } = useContext(MyContext);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [limit, setLimit] = useState("");
  const [isSeries, setIsSeries] = useState(false);
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(""); 
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setError(""); 
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!file || !title || !description || !genre || !limit) {
        setError("Please fill in all fields");
        return;
      }

      const formData = new FormData();
      formData.append("video", file);
      formData.append("image", image);
      formData.append("title", title);
      formData.append("desc", description);
      formData.append("genre", genre);
      formData.append("limit", limit);
      formData.append("isSeries", isSeries);

      const response = await axios.post(`${BaseURL}/movie/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File uploaded successfully:", response.data);
      toast.success("Movie Uploaded Successfully")
      setFile(null);
      setTitle("");
      setDescription("");
      setGenre("");
      setLimit("");
      setIsSeries(false);
      setImage(null);

    } catch (error) {
      console.error("Error uploading file:", error.message);
      setError("Something went wrong");
      toast.error("Something went wrong")
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {user && user.MyProfile && user.MyProfile.isAdmin ? (
        <div className="upload-page">
          <Link to={"/dashboard"} className="left-btn">
            Dashboard
          </Link>

          <Link to={"/"} className="right-btn">
            Home
          </Link>

          <h2 className="upload-title">Upload Movie</h2>

          {file && <p className="para">File Selected: {file.name}</p>}

          <label className="vlabel" htmlFor="video">
            Add Video
          </label>
          <input
            id="video"
            type="file"
            name="video"
            accept="video/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="upload-input"
          />
          <br />
          <label className="ilabel" htmlFor="image">
            Add Image
          </label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="upload-input"
          />

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="upload-input"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="upload-input"
          />

          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="upload-input"
          />

          <input
            type="text"
            placeholder="Rating e.g 18+"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="upload-input"
          />

          <label htmlFor="isSeries" className="upload-label">
            Is Series:
            <input
              id="isSeries"
              type="checkbox"
              checked={isSeries}
              onChange={(e) => setIsSeries(e.target.checked)}
              className="upload-checkbox"
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="upload-button"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          {error && <p className="upload-error">{error}</p>}
        </div>
      ) : (
        <div>
          <h1>Not Allowed</h1>
        </div>
      )}
      <ToastContainer/>
    </>
  );
};

export default UploadMovie;
