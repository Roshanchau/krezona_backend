import { Router } from "express";
import { gamesController } from "./games.controller";
import singleUpload from "../../middlewares/multer";

const router= Router();

// game routes
router.post("/" , singleUpload, gamesController.createGame);
router.get("/", gamesController.getAllGames);
router.get("/:id", gamesController.getGameById);
router.put("/:id",singleUpload, gamesController.updateGame);
router.delete("/", gamesController.deleteAllGames); // Route to delete all games
router.delete("/:id", gamesController.deleteGame);

export const gamesRoutes = router;