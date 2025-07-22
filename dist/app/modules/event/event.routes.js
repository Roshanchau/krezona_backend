"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRoutes = void 0;
const express_1 = require("express");
const event_controller_1 = require("./event.controller");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = (0, express_1.Router)();
// game routes
router.post("/", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), multer_1.default, event_controller_1.eventsController.createevent);
router.get("/", event_controller_1.eventsController.getAllevents);
router.get("/:id", event_controller_1.eventsController.geteventById);
router.put("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), multer_1.default, event_controller_1.eventsController.updateevent);
router.delete("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), event_controller_1.eventsController.deleteevent);
exports.eventsRoutes = router;
