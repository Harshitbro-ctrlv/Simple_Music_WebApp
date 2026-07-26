import express from "express";
import {
  createMusic,
  createAlbum,
  getAllMusic,
  getAllAlbums,
  getAlbumById,
} from "../controllers/music.controller.js";
import multer from "multer";
import { authArtist, authUser } from "../middleware/auth.middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
});
const router = express.Router();

router.post("/upload", authArtist, upload.single("music"), createMusic);
router.post("/albums", authArtist, createAlbum);
router.get("/", authUser, getAllMusic);
router.get("/albums", authUser, getAllAlbums);
router.get("/albums/:albumId", authUser, getAlbumById);
export default router;
