import { Router } from "express";
import { eventsController } from "./event.controller";
import singleUpload from "../../middlewares/multer";

const router= Router();

// game routes
router.post("/" , singleUpload, eventsController.createevent);
router.get("/", eventsController.getAllevents);
router.get("/:id", eventsController.geteventById);
router.put("/:id", eventsController.updateevent);
router.delete("/:id", eventsController.deleteevent);

export const eventsRoutes = router;