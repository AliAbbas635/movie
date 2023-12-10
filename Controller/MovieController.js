import Movie from "../Database/Models/Movie.js";
import User from "../Database/Models/User.js";
import { BlobServiceClient } from "@azure/storage-blob";



const AZURE_STORAGE_CONNECTION_STRING =
  "DefaultEndpointsProtocol=https;AccountName=netflixstoragea;AccountKey=yn4wSojCqXAZfScSK1QJRQuxlNSz2sye65+rBuy87RQgcMU8GlN6jSRWN392nB3jYs8WfRicI4D/+AStXtpKtA==;EndpointSuffix=core.windows.net";
const containerName = "movie";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(containerName);


//UPDATE

export const UpdateMovie = async (req, res) => {
  const usr = await User.findById(req.user);
  if (usr.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
};

//DELETE

export const DeleteMovie = async (req, res) => {
  const usr = await User.findById(req.user);
  if (usr.isAdmin) {
    console.log(req.params.id)
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("The movie has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
};

//GET

export const SearchMovie = async (req, res) => {
  const { title } = req.query;

  try {
    // Perform a case-insensitive search for movies with titles that partially match the provided title
    const movies = await Movie.find({ title: { $regex: new RegExp(title, 'i') } });

    if (movies.length === 0) {
      return res.status(404).json({ message: 'No movies found with that title.' });
    }

    res.status(200).json(movies);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Internal server error' });
  }
};


//GET RANDOM

export const RandomMovie = async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GEt Randomfifty

export const RandomFiftyMovie = async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 50 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 50 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET ALL

export const AllMovies = async (req, res) => {
  const usr = await User.findById(req.user);
 
    try {
      const movies = await Movie.find();
      res.status(200).json(movies.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
};

//upload movie

export const UploadMovie = async (req, res) => {
 
  try {
    if (!req.files) {
      console.log("No file uploaded");
      return res.status(400).send("No file uploaded");
    }

    const { title, desc, genre, limit, isSeries } = req.body;
    const videoFile = req.files.video[0].buffer;
    const imageFile = req.files.image[0].buffer;
    const videoFileName = req.files.video[0].originalname;
    const imageFileName = req.files.image[0].originalname;
 
    const blockBlobClient = containerClient.getBlockBlobClient(videoFileName);
    const blockBlobClientImage = containerClient.getBlockBlobClient(imageFileName);
 
    await blockBlobClient.upload(videoFile, videoFile.length);
    await blockBlobClientImage.upload(imageFile, imageFile.length);
 
    const blobUrl = blockBlobClient.url;
    const imageBlobUrl = blockBlobClientImage.url;
 
    const newMovie = new Movie({
      title,
      desc,
      gener: genre, 
      image: imageBlobUrl, 
      imgTitle: imageFileName,
      video: blobUrl, 
      limit,
      isSeries,
    });
 
    const savedMovie = await newMovie.save();
    res.status(200).json({ message: 'File uploaded successfully', savedMovie });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
 };