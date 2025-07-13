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
exports.eventsService = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create a new event
const createevent = (eventData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, eventDate, image } = eventData;
    if (!name || !eventData) {
        throw new appError_1.default(400, "name and eventDate are required");
    }
    const existingevent = yield prismaDb_1.default.event.findFirst({
        where: {
            name: name,
        },
    });
    if (existingevent) {
        throw new appError_1.default(400, "event with this name already exists");
    }
    const newevent = yield prismaDb_1.default.event.create({
        data: {
            name,
            eventDate,
            image: {
                create: {
                    fileId: (image === null || image === void 0 ? void 0 : image.fileId) || "",
                    name: (image === null || image === void 0 ? void 0 : image.name) || "",
                    url: (image === null || image === void 0 ? void 0 : image.url) || "",
                    thumbnailUrl: (image === null || image === void 0 ? void 0 : image.thumbnailUrl) || "",
                },
            },
        },
    });
    return { event: newevent };
});
// get all events
const getAllevents = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield prismaDb_1.default.event.findMany({
        include: {
            image: true,
        },
    });
    if (!events || events.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No events found",
        });
    }
    return events;
});
// get event by id
const geteventById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield prismaDb_1.default.event.findFirst({
        where: {
            id: id,
        },
        include: {
            image: true,
        },
    });
    if (!event) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "event not found with this id",
        });
    }
    return event;
});
// update event
const updateevent = (id, eventData, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, eventDate, image } = eventData;
    if (!name || !eventDate) {
        throw new appError_1.default(400, "name and eventDate are required");
    }
    const existingevent = yield prismaDb_1.default.event.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingevent) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "event not found with this id",
        });
    }
    const existingImage = yield prismaDb_1.default.image.findFirst({
        where: {
            eventId: id,
        },
    });
    let updatedevent;
    if (!image) {
        yield prismaDb_1.default.image.deleteMany({
            where: {
                eventId: id,
            },
        });
        updatedevent = yield prismaDb_1.default.event.update({
            where: {
                id: id,
            },
            data: {
                name,
                eventDate,
                image: {
                    create: {
                        fileId: (existingImage === null || existingImage === void 0 ? void 0 : existingImage.fileId) || "",
                        name: (existingImage === null || existingImage === void 0 ? void 0 : existingImage.name) || "",
                        url: (existingImage === null || existingImage === void 0 ? void 0 : existingImage.url) || "",
                        thumbnailUrl: (existingImage === null || existingImage === void 0 ? void 0 : existingImage.thumbnailUrl) || "",
                    },
                },
            },
        });
        return { event: updatedevent };
    }
    yield prismaDb_1.default.image.deleteMany({
        where: {
            eventId: id,
        },
    });
    updatedevent = yield prismaDb_1.default.event.update({
        where: {
            id: id,
        },
        data: {
            name,
            eventDate,
            image: {
                create: {
                    fileId: image.fileId || "",
                    name: image.name || "",
                    url: image.url || "",
                    thumbnailUrl: image.thumbnailUrl || "",
                },
            },
        },
    });
    return { event: updatedevent };
});
// delete event
const deleteevent = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingevent = yield prismaDb_1.default.event.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingevent) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "event not found with this id",
        });
    }
    const event = yield prismaDb_1.default.event.delete({
        where: {
            id: id,
        },
    });
    return event;
});
exports.eventsService = {
    createevent,
    getAllevents,
    geteventById,
    updateevent,
    deleteevent,
};
