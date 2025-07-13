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
exports.blogsController = void 0;
const blog_services_1 = require("./blog.services");
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const uploadImage_1 = require("../../utils/uploadImage");
const getDataUri_1 = __importDefault(require("../../utils/getDataUri"));
// create a new blog
const createblog = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
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
    const { blog } = yield blog_services_1.blogsService.createblog({ title, content, image });
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "blog created successfully",
        data: { blog },
    });
}));
// get all blogs
const getAllblogs = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blog_services_1.blogsService.getAllblogs(res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "blogs retrieved successfully",
        data: { blogs },
    });
}));
// get blog by id
const getblogById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const blog = yield blog_services_1.blogsService.getblogById(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "blog retrieved successfully",
        data: { blog },
    });
}));
// update blog 
const updateblog = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content } = req.body;
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
    const updatedblog = yield blog_services_1.blogsService.updateblog(id, { title, content, image }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "blog updated successfully",
        data: { blog: updatedblog },
    });
}));
// delete blog
const deleteblog = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedblog = yield blog_services_1.blogsService.deleteblog(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "blog deleted successfully",
        data: { blog: deletedblog },
    });
}));
exports.blogsController = {
    createblog,
    getAllblogs,
    getblogById,
    updateblog,
    deleteblog,
};
