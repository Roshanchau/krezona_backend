"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesController = void 0;
const games_services_1 = require("./games.services");
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const uploadImage_1 = require("../../utils/uploadImage");
const getDataUri_1 = __importDefault(require("../../utils/getDataUri"));
// create a new game
const createGame = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    let image = undefined;
    if (req.file) {
        image = yield (0, uploadImage_1.uploadImage)((0, getDataUri_1.default)(req.file).content, (0, getDataUri_1.default)(req.file).fileName, "people");
        if (!image) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 400,
                success: false,
                message: "Failed to upload photo",
            });
        }
    }
    const { game } = yield games_services_1.gamesService.createGame({ title, description, image });
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Game created successfully",
        data: { game },
    });
}));
// get all games
const getAllGames = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield games_services_1.gamesService.getAllGames(res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Games retrieved successfully",
        data: { games },
    });
}));
// get game by id
const getGameById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const game = yield games_services_1.gamesService.getGameById(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Game retrieved successfully",
        data: { game },
    });
}));
// update game 
const updateGame = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("update", req.body);
    const { title, description } = req.body;
    let image = undefined;
    if (req.file) {
        image = yield (0, uploadImage_1.uploadImage)((0, getDataUri_1.default)(req.file).content, (0, getDataUri_1.default)(req.file).fileName, "people");
        if (!image) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 400,
                success: false,
                message: "Failed to upload photo",
            });
        }
    }
    const updatedGame = yield games_services_1.gamesService.updateGame(id, { title, description, image }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Game updated successfully",
        data: { game: updatedGame },
    });
}));
// delete game
const deleteGame = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedGame = yield games_services_1.gamesService.deleteGame(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Game deleted successfully",
        data: { game: deletedGame },
    });
}));
exports.gamesController = {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame,
};
