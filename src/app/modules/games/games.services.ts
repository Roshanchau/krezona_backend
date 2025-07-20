import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";
import sendResponse from "../../middlewares/sendResponse";
import { TGame } from "./games.interface";
import { Response } from "express";

// create a new game
const createGame = async (gameData: TGame) => {
  const { title, description, image } = gameData;

  if (!title || !description) {
    throw new AppError(400, "Title and description are required");
  }

  const existingGame = await prismadb.game.findFirst({
    where: {
      title: title,
    },
  });

  if (existingGame) {
    throw new AppError(400, "Game with this title already exists");
  }

  const newGame = await prismadb.game.create({
    data: {
      title,
      description,
      image: {
        create: {
          fileId: image?.fileId || "",
          name: image?.name || "",
          url: image?.url || "",
          thumbnailUrl: image?.thumbnailUrl || "",
        },
      },
    },
  });

  return { game: newGame };
};

// get all games
const getAllGames = async (res: Response) => {
  const games = await prismadb.game.findMany({
    include:{
      image:true
    }
  });

  if (!games || games.length === 0) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No games found",
    });
  }

  return games;
};

// get game by id
const getGameById = async (id: string, res: Response) => {
  const game = await prismadb.game.findFirst({
    where: {
      id: id,
    },
    include: {
      image: true,
    },
  });

  if (!game) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Game not found with this id",
    });
  }

  return game;
};

// update game
const updateGame = async (id: string, gameData: TGame, res: Response) => {
  const { title, description, image } = gameData;

  if (!title || !description) {
    throw new AppError(400, "Title and description are required");
  }

  const existingGame = await prismadb.game.findFirst({
    where: {
      id: id,
    },
  });

  if (!existingGame) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Game not found with this id",
    });
  }

  const existingimage = await prismadb.gameImage.findFirst({
    where: {
      gameId: id,
    },
  });

  let updatedGame;
  if (!image) {
    await prismadb.gameImage.deleteMany({
      where: {
        gameId: id,
      },
    });

    updatedGame = await prismadb.game.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        image: {
          create: {
            fileId: existingimage?.fileId || "",
            name: existingimage?.name || "",
            url: existingimage?.url || "",
            thumbnailUrl: existingimage?.thumbnailUrl || "",
          },
        },
      },
    });

    return { game: updatedGame };
  }

  await prismadb.gameImage.deleteMany({
    where: {
      gameId: id,
    },
  });

   updatedGame = await prismadb.game.update({
        where:{
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
};


// delete game
const deleteGame = async (id: string, res: Response) => {
  const existingGame = await prismadb.game.findFirst({
    where: {
      id: id,
    },
    });

    if (!existingGame) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Game not found with this id",
        });
    }

    const game= await prismadb.game.delete({
        where: {
            id: id,
        },
    });


    return game;
};

// delet all games
const deleteAllGames = async (res: Response) => {
  const games = await prismadb.game.deleteMany({});

  if (!games) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No games found to delete",
    });
  }

  return games;
};


export const gamesService = {
  createGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame,
  deleteAllGames,
};