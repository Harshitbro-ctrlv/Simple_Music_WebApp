import musicModel from "../models/music.model.js";
import jwt from "jsonwebtoken";
import { uploadFile } from "../services/storage.service.js";
import albumModel from "../models/album.model.js";

export async function createMusic(req, res) {
  const { title } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const uploadedFile = await uploadFile(file.buffer, file.originalname);

  if (!uploadedFile.url) {
    throw new Error("ImageKit upload completed without returning a URL");
  }

  const music = await musicModel.create({
    uri: uploadedFile.url,
    title: title,
    artist: req.user.id,
  });
  res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    },
  });
}

export async function createAlbum(req, res) {
  const { title, musics } = req.body;

  const album = await albumModel.create({
    title,
    artist: req.user.id,
    musics,
  });
  res.status(201).json({
    message: "Album created successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      music: album.musics,
    },
  });
}

export async function getAllMusic(req, res) {
  const music = await musicModel
    .find()
    .limit(10)
    .populate("artist", "username email");

  res.status(200).json({
    message: "All music fetched successfully",
    music: music,
  });
}

export async function getAllAlbums(req, res) {
  const albums = await albumModel
    .find()
    .populate("artist", "username email")
    .populate("musics", "title uri");
  res.status(200).json({
    message: "All albums fetched successfully",
    albums: albums,
  });
}

export async function getAlbumById(req, res) {
  const { albumId } = req.params;
  const album = await albumModel
    .findById(albumId)
    .populate("artist", "username email")
    .populate("musics", "title uri");
  res.status(200).json({
    message: "Album fetched successfully",
    album: album,
  });
}
