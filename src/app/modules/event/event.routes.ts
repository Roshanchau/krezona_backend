import { Router } from "express";
import { eventsController } from "./event.controller";
import singleUpload from "../../middlewares/multer";
import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";

const router= Router();

// game routes
router.post("/" ,verifyToken , authorizeRole("ADMIN"), singleUpload, eventsController.createevent);
router.get("/",eventsController.getAllevents);
router.get("/:id", eventsController.geteventById);
router.put("/:id",verifyToken , authorizeRole("ADMIN"),singleUpload, eventsController.updateevent);
router.delete("/:id",verifyToken , authorizeRole("ADMIN"), eventsController.deleteevent);

export const eventsRoutes = router;