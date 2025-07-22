import { Router } from "express";
import { gamesController } from "./games.controller";
import singleUpload from "../../middlewares/multer";
import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";

const router= Router();

// game routes
router.post("/" ,verifyToken , authorizeRole("ADMIN"), singleUpload, gamesController.createGame);
router.get("/", gamesController.getAllGames);
router.get("/:id", gamesController.getGameById);
router.put("/:id",verifyToken , authorizeRole("ADMIN"),singleUpload, gamesController.updateGame);
router.delete("/",verifyToken , authorizeRole("ADMIN"), gamesController.deleteAllGames); // Route to delete all games
router.delete("/:id",verifyToken , authorizeRole("ADMIN"), gamesController.deleteGame);

export const gamesRoutes = router;