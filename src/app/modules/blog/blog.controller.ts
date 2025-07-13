import { blogsService } from "./blog.services";
import { Request, Response } from "express";
import sendResponse from "../../middlewares/sendResponse";
import catchAsyncError from "../../utils/catchAsyncError";
import { UploadImageResponse } from "../../utils/uploadImage";
import { uploadImage } from "../../utils/uploadImage";
import getDataUri from "../../utils/getDataUri";

// create a new blog
const createblog = catchAsyncError(async (req: Request, res: Response) => {
  const { title, content } = req.body;
  
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
    const { blog } = await blogsService.createblog({title, content ,image });
    
    return sendResponse(res, {
        statusCode: 201,
    success: true,
    message: "blog created successfully",
    data: { blog },
  });
});


// get all blogs
const getAllblogs = catchAsyncError(async (req: Request, res: Response) => {
  const blogs = await blogsService.getAllblogs(res);
  
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "blogs retrieved successfully",
    data: { blogs },
  });
});

// get blog by id
const getblogById = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const blog = await blogsService.getblogById(id , res);
  
  
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "blog retrieved successfully",
    data: { blog },
  });
});

// update blog 
const updateblog = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

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

  const updatedblog = await blogsService.updateblog(id, { title, content, image }, res);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "blog updated successfully",
    data: { blog: updatedblog },
  });
});


// delete blog
const deleteblog = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
    const deletedblog = await blogsService.deleteblog(id, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "blog deleted successfully",
        data: { blog: deletedblog },
    });
});

export const blogsController = {
  createblog,
  getAllblogs,
  getblogById,
  updateblog,
  deleteblog,
};