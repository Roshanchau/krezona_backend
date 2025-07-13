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
exports.gamesService = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create a new game
const createGame = (gameData) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, image } = gameData;
    if (!title || !description) {
        throw new appError_1.default(400, "Title and description are required");
    }
    const existingGame = yield prismaDb_1.default.game.findFirst({
        where: {
            title: title,
        },
    });
    if (existingGame) {
        throw new appError_1.default(400, "Game with this title already exists");
    }
    const newGame = yield prismaDb_1.default.game.create({
        data: {
            title,
            description,
            image: {
                create: {
                    fileId: (image === null || image === void 0 ? void 0 : image.fileId) || "",
                    name: (image === null || image === void 0 ? void 0 : image.name) || "",
                    url: (image === null || image === void 0 ? void 0 : image.url) || "",
                    thumbnailUrl: (image === null || image === void 0 ? void 0 : image.thumbnailUrl) || "",
                },
            },
        },
    });
    return { game: newGame };
});
// get all games
const getAllGames = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield prismaDb_1.default.game.findMany({
        include: {
            image: {
                select: {
                    url: true,
                }
            },
        },
    });
    if (!games || games.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No games found",
        });
    }
    return games;
});
// get game by id
const getGameById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game = yield prismaDb_1.default.game.findFirst({
        where: {
            id: id,
        },
        include: {
            image: true,
        },
    });
    if (!game) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Game not found with this id",
        });
    }
    return game;
});
// update game
const updateGame = (id, gameData, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, image } = gameData;
    if (!title || !description) {
        throw new appError_1.default(400, "Title and description are required");
    }
    const existingGame = yield prismaDb_1.default.game.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingGame) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Game not found with this id",
        });
    }
    const existingimage = yield prismaDb_1.default.gameImage.findFirst({
        where: {
            gameId: id,
        },
    });
    let updatedGame;
    if (!image) {
        yield prismaDb_1.default.gameImage.deleteMany({
            where: {
                gameId: id,
            },
        });
        updatedGame = yield prismaDb_1.default.game.update({
            where: {
                id: id,
            },
            data: {
                title,
                description,
                image: {
                    create: {
                        fileId: (existingimage === null || existingimage === void 0 ? void 0 : existingimage.fileId) || "",
                        name: (existingimage === null || existingimage === void 0 ? void 0 : existingimage.name) || "",
                        url: (existingimage === null || existingimage === void 0 ? void 0 : existingimage.url) || "",
                        thumbnailUrl: (existingimage === null || existingimage === void 0 ? void 0 : existingimage.thumbnailUrl) || "",
                    },
                },
            },
        });
        return { game: updatedGame };
    }
    yield prismaDb_1.default.gameImage.deleteMany({
        where: {
            gameId: id,
        },
    });
    updatedGame = yield prismaDb_1.default.game.update({
        where: {
            id: id,
        },
        data: {
            title,
            description,
            image: {
                create: {
                    fileId: image.fileId || "",
                    name: image.name || "",
                    url: image.url || "",
                    thumbnailUrl: image.thumbnailUrl || "",
                },
            },
        },
    });
    return { game: updatedGame };
});
// delete game
const deleteGame = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingGame = yield prismaDb_1.default.game.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingGame) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Game not found with this id",
        });
    }
    const game = yield prismaDb_1.default.game.delete({
        where: {
            id: id,
        },
    });
    return game;
});
exports.gamesService = {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame,
};
