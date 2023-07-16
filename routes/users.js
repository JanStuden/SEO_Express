import express from "express";
import {signUp, login, getUser, updateUser, resetPassword, deleteUser} from "../controllers/users.js";
import {authenticateJWT} from "../services/authentication.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/getUser/:localUser", authenticateJWT, getUser);
router.delete("/deleteUser", authenticateJWT, deleteUser);
router.post("/updateUser", updateUser);
router.post("/resetPassword", resetPassword);

export default router;
