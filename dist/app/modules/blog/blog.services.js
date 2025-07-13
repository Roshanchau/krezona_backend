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
exports.blogsService = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create a new blog
const createblog = (blogData) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, image } = blogData;
    if (!title || !blogData) {
        throw new appError_1.default(400, "title and content are required");
    }
    const existingblog = yield prismaDb_1.default.blog.findFirst({
        where: {
            title: title,
        },
    });
    if (existingblog) {
        throw new appError_1.default(400, "blog with this title already exists");
    }
    const newblog = yield prismaDb_1.default.blog.create({
        data: {
            title,
            content,
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
    return { blog: newblog };
});
// get all blogs
const getAllblogs = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield prismaDb_1.default.blog.findMany({
        include: {
            image: {
                select: {
                    url: true,
                },
            },
        },
    });
    if (!blogs || blogs.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No blogs found",
        });
    }
    return blogs;
});
// get blog by id
const getblogById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield prismaDb_1.default.blog.findFirst({
        where: {
            id: id,
        },
        include: {
            image: true,
        },
    });
    if (!blog) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "blog not found with this id",
        });
    }
    return blog;
});
// update blog
const updateblog = (id, blogData, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, image } = blogData;
    if (!title || !content) {
        throw new appError_1.default(400, "title and content are required");
    }
    const existingblog = yield prismaDb_1.default.blog.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingblog) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "blog not found with this id",
        });
    }
    const existingImage = yield prismaDb_1.default.blogImage.findFirst({
        where: {
            blogId: id,
        },
    });
    let updatedblog;
    if (!image) {
        yield prismaDb_1.default.blogImage.deleteMany({
            where: {
                blogId: id,
            },
        });
        updatedblog = yield prismaDb_1.default.blog.update({
            where: {
                id: id,
            },
            data: {
                title,
                content,
                image: {
                    create: {
                        fileId: (existingImage === null || existingImage === void 0 ? void 0 : existingImage.fileId) || "",
                        name: (existingImage === null || existingImage === void 0 ? void 0 : existingImage.name) || "",
                        url: (existingImage === null || existingImage === void 0 ? void 0 : existingImage.url) || "",
                        thumbnailUrl: (existingImage === null || existingImage === void 0 ? void 0 : existingImage.thumbnailUrl) || "",
                    },
                },
            },
        });
        return { blog: updatedblog };
    }
    yield prismaDb_1.default.blogImage.deleteMany({
        where: {
            blogId: id,
        },
    });
    updatedblog = yield prismaDb_1.default.blog.update({
        where: {
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
});
// delete blog
const deleteblog = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingblog = yield prismaDb_1.default.blog.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingblog) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "blog not found with this id",
        });
    }
    const blog = yield prismaDb_1.default.blog.delete({
        where: {
            id: id,
        },
    });
    return blog;
});
exports.blogsService = {
    createblog,
    getAllblogs,
    getblogById,
    updateblog,
    deleteblog,
};
