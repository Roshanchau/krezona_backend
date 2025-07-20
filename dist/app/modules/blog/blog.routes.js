"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRoutes = void 0;
const express_1 = require("express");
const blog_controller_1 = require("./blog.controller");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = (0, express_1.Router)();
// game routes
router.post("/", multer_1.default, blog_controller_1.blogsController.createblog);
router.get("/", blog_controller_1.blogsController.getAllblogs);
router.get("/:id", blog_controller_1.blogsController.getblogById);
router.put("/:id", multer_1.default, blog_controller_1.blogsController.updateblog);
router.delete("/:id", blog_controller_1.blogsController.deleteblog);
exports.blogsRoutes = router;
