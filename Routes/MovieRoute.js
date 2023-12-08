import express from "express";
import { isAuth } from "../Middleware/isAuth.js";
import { AllMovies, DeleteMovie, RandomFiftyMovie, RandomMovie, SearchMovie, UpdateMovie, UploadMovie } from "../Controller/MovieController.js";
import multer from "multer";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put("/:id",isAuth, UpdateMovie)
router.delete("/:id",isAuth, DeleteMovie)
router.get("/find", isAuth,SearchMovie)
router.get("/random",RandomMovie) 
router.get("/random50",RandomFiftyMovie)
router.get("/", AllMovies)
router.post("/upload", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]) ,UploadMovie)
  

export default router


