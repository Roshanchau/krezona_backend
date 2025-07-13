import { Router } from "express";
import { blogsController } from "./blog.controller";
import singleUpload from "../../middlewares/multer";

const router= Router();

// game routes
router.post("/" , singleUpload, blogsController.createblog);
router.get("/", blogsController.getAllblogs);
router.get("/:id", blogsController.getblogById);
router.put("/:id", blogsController.updateblog);
router.delete("/:id", blogsController.deleteblog);

export const blogsRoutes = router;