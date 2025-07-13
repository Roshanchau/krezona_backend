"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesRoutes = void 0;
const express_1 = require("express");
const games_controller_1 = require("./games.controller");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = (0, express_1.Router)();
// game routes
router.post("/", multer_1.default, games_controller_1.gamesController.createGame);
router.get("/", games_controller_1.gamesController.getAllGames);
router.get("/:id", games_controller_1.gamesController.getGameById);
router.put("/:id", games_controller_1.gamesController.updateGame);
router.delete("/:id", games_controller_1.gamesController.deleteGame);
exports.gamesRoutes = router;
