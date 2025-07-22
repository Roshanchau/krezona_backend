"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesRoutes = void 0;
const express_1 = require("express");
const games_controller_1 = require("./games.controller");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = (0, express_1.Router)();
// game routes
router.post("/", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), multer_1.default, games_controller_1.gamesController.createGame);
router.get("/", games_controller_1.gamesController.getAllGames);
router.get("/:id", games_controller_1.gamesController.getGameById);
router.put("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), multer_1.default, games_controller_1.gamesController.updateGame);
router.delete("/", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), games_controller_1.gamesController.deleteAllGames); // Route to delete all games
router.delete("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), games_controller_1.gamesController.deleteGame);
exports.gamesRoutes = router;
