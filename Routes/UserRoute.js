import express from "express";
import { Register,Login, Logout , UpdateUser, DeleteUser, GetUser,GetAllUsers, Stats, MyProfile} from "../Controller/UserController.js";
import { isAuth } from "../Middleware/isAuth.js";

const router = express.Router();
router.get("/profile", isAuth, MyProfile)
router.post("/register", Register);
router.post("/login", Login)
router.get("/logout", Logout)
router.get("/getuser/:id", isAuth,GetUser)
router.get("/",isAuth,GetAllUsers)
router.put("/:id" , isAuth, UpdateUser)
router.delete("/:id" , isAuth, DeleteUser)
router.get("/stats", Stats)

export default router