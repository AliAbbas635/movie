import express from "express";
import { Register,Login, Logout , UpdateUser, DeleteUser, GetUser,GetAllUsers, Stats, MyProfile, UpdateMyProfile} from "../Controller/UserController.js";
import { isAuth } from "../Middleware/isAuth.js";

const router = express.Router();
router.get("/profile",isAuth, MyProfile)
router.post("/register", Register);
router.post("/login", Login)
router.get("/logout", Logout)
router.get("/",isAuth,GetAllUsers)
router.get("/stats", Stats)
router.put("/profile", isAuth, UpdateMyProfile);
router.get("/getuser/:id", isAuth,GetUser)
router.put("/:id" , isAuth, UpdateUser)
router.delete("/:id" , isAuth, DeleteUser)

export default router