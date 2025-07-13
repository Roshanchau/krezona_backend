import { eventsService } from "./event.services";
import { Request, Response } from "express";
import sendResponse from "../../middlewares/sendResponse";
import catchAsyncError from "../../utils/catchAsyncError";
import { UploadImageResponse } from "../../utils/uploadImage";
import { uploadImage } from "../../utils/uploadImage";
import getDataUri from "../../utils/getDataUri";

// create a new event
const createevent = catchAsyncError(async (req: Request, res: Response) => {
  const { name, eventDate } = req.body;
  
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
    const { event } = await eventsService.createevent({ name, eventDate ,image });
    
    return sendResponse(res, {
        statusCode: 201,
    success: true,
    message: "event created successfully",
    data: { event },
  });
});


// get all events
const getAllevents = catchAsyncError(async (req: Request, res: Response) => {
  const events = await eventsService.getAllevents(res);
  
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "events retrieved successfully",
    data: { events },
  });
});

// get event by id
const geteventById = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const event = await eventsService.geteventById(id , res);
  
  
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "event retrieved successfully",
    data: { event },
  });
});

// update event 
const updateevent = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, eventDate } = req.body;

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

  const updatedevent = await eventsService.updateevent(id, { name, eventDate, image }, res);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "event updated successfully",
    data: { event: updatedevent },
  });
});


// delete event
const deleteevent = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
    const deletedevent = await eventsService.deleteevent(id, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "event deleted successfully",
        data: { event: deletedevent },
    });
});

export const eventsController = {
  createevent,
  getAllevents,
  geteventById,
  updateevent,
  deleteevent,
};