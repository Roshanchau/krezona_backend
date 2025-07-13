import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";
import sendResponse from "../../middlewares/sendResponse";
import { TBlog } from "./blog.interface";
import { Response } from "express";

// create a new blog
const createblog = async (blogData: TBlog) => {
  const { title, content, image } = blogData;

  if (!title || !blogData) {
    throw new AppError(400, "title and content are required");
  }

  const existingblog = await prismadb.blog.findFirst({
    where: {
      title: title,
    },
  });

  if (existingblog) {
    throw new AppError(400, "blog with this title already exists");
  }

  const newblog = await prismadb.blog.create({
    data: {
      title,
      content,
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

  return { blog: newblog };
};

// get all blogs
const getAllblogs = async (res: Response) => {
  const blogs = await prismadb.blog.findMany({
    include: {
      image: {
        select: {
          url: true,
        },
      },
    },
  });

  if (!blogs || blogs.length === 0) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No blogs found",
    });
  }

  return blogs;
};

// get blog by id
const getblogById = async (id: string, res: Response) => {
  const blog = await prismadb.blog.findFirst({
    where: {
      id: id,
    },
    include: {
      image: true,
    },
  });

  if (!blog) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "blog not found with this id",
    });
  }

  return blog;
};

// update blog
const updateblog = async (id: string, blogData: TBlog, res: Response) => {
  const { title, content, image } = blogData;

  if (!title || !content) {
    throw new AppError(400, "title and content are required");
  }

  const existingblog = await prismadb.blog.findFirst({
    where: {
      id: id,
    },
  });

  if (!existingblog) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "blog not found with this id",
    });
  }

  const existingImage = await prismadb.blogImage.findFirst({
    where: {
      blogId: id,
    },
  });

  let updatedblog;
  if (!image) {
    await prismadb.blogImage.deleteMany({
      where: {
        blogId: id,
      },
    });

    updatedblog = await prismadb.blog.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        image: {
          create: {
            fileId: existingImage?.fileId || "",
            name: existingImage?.name || "",
            url: existingImage?.url || "",
            thumbnailUrl: existingImage?.thumbnailUrl || "",
          },
        },
      },
    });

    return { blog: updatedblog };
  }

  await prismadb.blogImage.deleteMany({
    where: {
      blogId: id,
    },
  });

   updatedblog = await prismadb.blog.update({
        where:{
            id: id,
        },

        data: {
            title,
            content,
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

  return { blog: updatedblog };
};


// delete blog
const deleteblog = async (id: string, res: Response) => {
  const existingblog = await prismadb.blog.findFirst({
    where: {
      id: id,
    },
    });

    if (!existingblog) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "blog not found with this id",
        });
    }

    const blog= await prismadb.blog.delete({
        where: {
            id: id,
        },
    });


    return blog;
};

export const blogsService = {
  createblog,
  getAllblogs,
  getblogById,
  updateblog,
  deleteblog,
};