import React, { useState } from "react";
import axios from "axios";
import "./UploadMovie.css";
import { MyContext } from "../ContextApi/MyContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
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
    setError(""); // Reset error on file change
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setError(""); // Reset error on image change
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

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(
        "http://localhost:5000/movie/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error.message);
      setError("Something went wrong");
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

          <h2 className="upload-title">Upload Page</h2>

          {file && <p className="para">File Selected: {file.name}</p>}

          <input
            type="file"
            name="video"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="upload-input"
          />

          <input
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
            placeholder="Limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="upload-input"
          />
          <label className="upload-label">
            Is Series:
            <input
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
    </>
  );
};

export default UploadMovie;
