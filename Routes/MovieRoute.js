import express from "express";
import { isAuth } from "../Middleware/isAuth.js";
import { AllMovies, DeleteMovie, RandomFiftyMovie, RandomMovie, SearchMovie, UpdateMovie, UploadMovie, MovieStats } from "../Controller/MovieController.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Movie Routes
router.put("/:id", isAuth, UpdateMovie);
router.delete("/:id", isAuth, DeleteMovie);
router.get("/find", isAuth, SearchMovie);
router.get("/random", RandomMovie);
router.get("/random50", RandomFiftyMovie);
router.get("/", isAuth, AllMovies);
router.post("/upload", isAuth, upload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'video', maxCount: 1 }
  ]), UploadMovie);
  
router.get("/stat", isAuth, MovieStats);  

export default router;
