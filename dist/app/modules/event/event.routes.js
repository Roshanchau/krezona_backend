"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRoutes = void 0;
const express_1 = require("express");
const event_controller_1 = require("./event.controller");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = (0, express_1.Router)();
// game routes
router.post("/", multer_1.default, event_controller_1.eventsController.createevent);
router.get("/", event_controller_1.eventsController.getAllevents);
router.get("/:id", event_controller_1.eventsController.geteventById);
router.put("/:id", event_controller_1.eventsController.updateevent);
router.delete("/:id", event_controller_1.eventsController.deleteevent);
exports.eventsRoutes = router;
