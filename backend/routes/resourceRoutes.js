import express from "express";
import { getAllResource, createResource, getResource, updateResource, deleteResource } from "../controllers/resourceController.js";

const router = express.Router();


router.get("/", getAllResource);
router.get("/:id", getResource);
router.post("/", createResource);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);

export default router; 