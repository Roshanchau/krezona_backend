import { Router } from "express";
import { blogsController } from "./blog.controller";
import singleUpload from "../../middlewares/multer";
import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";

const router= Router();

// blog routes
router.post("/" ,verifyToken ,authorizeRole("ADMIN") , singleUpload, blogsController.createblog);
router.get("/", blogsController.getAllblogs);
router.get("/:id", blogsController.getblogById);
router.put("/:id",verifyToken ,authorizeRole("ADMIN") ,singleUpload, blogsController.updateblog);
router.delete("/:id",verifyToken ,authorizeRole("ADMIN"),  blogsController.deleteblog);

export const blogsRoutes = router;