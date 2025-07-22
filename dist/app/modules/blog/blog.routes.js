"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRoutes = void 0;
const express_1 = require("express");
const blog_controller_1 = require("./blog.controller");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = (0, express_1.Router)();
// blog routes
router.post("/", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), multer_1.default, blog_controller_1.blogsController.createblog);
router.get("/", blog_controller_1.blogsController.getAllblogs);
router.get("/:id", blog_controller_1.blogsController.getblogById);
router.put("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), multer_1.default, blog_controller_1.blogsController.updateblog);
router.delete("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), blog_controller_1.blogsController.deleteblog);
exports.blogsRoutes = router;
