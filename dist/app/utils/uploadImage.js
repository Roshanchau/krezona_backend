"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const imageKit_1 = __importDefault(require("../config/imageKit"));
const uploadImage = (file, fileName, folder) => {
    return new Promise((resolve, reject) => {
        imageKit_1.default.upload({
            file,
            fileName,
            folder: folder,
        }, (err, result) => {
            if (err) {
                return reject(err.message);
            }
            else {
                const response = {
                    url: result === null || result === void 0 ? void 0 : result.url,
                    fileId: result === null || result === void 0 ? void 0 : result.fileId,
                    name: result === null || result === void 0 ? void 0 : result.name,
                    thumbnailUrl: result === null || result === void 0 ? void 0 : result.thumbnailUrl
                };
                return resolve(response);
            }
        });
    });
};
exports.uploadImage = uploadImage;
const deleteImage = (fileId) => {
    return new Promise((resolve, reject) => {
        imageKit_1.default.deleteFile(fileId, (err, result) => {
            if (err) {
                return reject(err.message);
            }
            else {
                return resolve(result);
            }
        });
    });
};
exports.deleteImage = deleteImage;
