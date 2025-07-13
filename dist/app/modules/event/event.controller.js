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
exports.eventsController = void 0;
const event_services_1 = require("./event.services");
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const uploadImage_1 = require("../../utils/uploadImage");
const getDataUri_1 = __importDefault(require("../../utils/getDataUri"));
// create a new event
const createevent = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, eventDate } = req.body;
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
    const { event } = yield event_services_1.eventsService.createevent({ name, eventDate, image });
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "event created successfully",
        data: { event },
    });
}));
// get all events
const getAllevents = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield event_services_1.eventsService.getAllevents(res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "events retrieved successfully",
        data: { events },
    });
}));
// get event by id
const geteventById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const event = yield event_services_1.eventsService.geteventById(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "event retrieved successfully",
        data: { event },
    });
}));
// update event 
const updateevent = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, eventDate } = req.body;
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
    const updatedevent = yield event_services_1.eventsService.updateevent(id, { name, eventDate, image }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "event updated successfully",
        data: { event: updatedevent },
    });
}));
// delete event
const deleteevent = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedevent = yield event_services_1.eventsService.deleteevent(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "event deleted successfully",
        data: { event: deletedevent },
    });
}));
exports.eventsController = {
    createevent,
    getAllevents,
    geteventById,
    updateevent,
    deleteevent,
};
