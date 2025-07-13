import { gamesService } from "./games.services";
import { Request, Response } from "express";
import sendResponse from "../../middlewares/sendResponse";
import catchAsyncError from "../../utils/catchAsyncError";
import { UploadImageResponse } from "../../utils/uploadImage";
import { uploadImage } from "../../utils/uploadImage";
import getDataUri from "../../utils/getDataUri";

// create a new game
const createGame = catchAsyncError(async (req: Request, res: Response) => {
  const { title, description } = req.body;
  
  let image: UploadImageResponse | undefined = undefined;
  if (req.file) {
      image = await uploadImage(
          getDataUri(req.file).content,
          getDataUri(req.file).fileName,
          "people"
        );
        if (!image) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Failed to upload photo",
            });
        }
    }
    const { game } = await gamesService.createGame({ title, description ,image });
    
    return sendResponse(res, {
        statusCode: 201,
    success: true,
    message: "Game created successfully",
    data: { game },
  });
});


// get all games
const getAllGames = catchAsyncError(async (req: Request, res: Response) => {
  const games = await gamesService.getAllGames(res);
  
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Games retrieved successfully",
    data: { games },
  });
});

// get game by id
const getGameById = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const game = await gamesService.getGameById(id , res);
  
  
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Game retrieved successfully",
    data: { game },
  });
});

// update game 
const updateGame = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  let image: UploadImageResponse | undefined = undefined;
  if (req.file) {
    image = await uploadImage(
      getDataUri(req.file).content,
      getDataUri(req.file).fileName,
      "people"
    );
    if (!image) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Failed to upload photo",
      });
    }
  }

  const updatedGame = await gamesService.updateGame(id, { title, description, image }, res);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Game updated successfully",
    data: { game: updatedGame },
  });
});


// delete game
const deleteGame = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
    const deletedGame = await gamesService.deleteGame(id, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Game deleted successfully",
        data: { game: deletedGame },
    });
});

export const gamesController = {
  createGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame,
};