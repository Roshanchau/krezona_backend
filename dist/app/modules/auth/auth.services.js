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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const appError_1 = __importDefault(require("../../errors/appError"));
const auth_utils_1 = require("./auth.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const config_1 = __importDefault(require("../../config"));
const zod_1 = __importDefault(require("zod"));
const emailSchema = zod_1.default.string().email();
// create user
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = payload;
    if (!name || !email || !password || !role) {
        throw new appError_1.default(400, "Please provide all fields");
    }
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
        throw new appError_1.default(400, "Invalid email format");
    }
    const existingUser = yield prismaDb_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    if (existingUser) {
        throw new appError_1.default(400, "User already exists with this email");
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const user = yield prismaDb_1.default.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            role
        }
    });
    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
// login user
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    if (!email || !password) {
        throw new appError_1.default(400, "Please provide all fields");
    }
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!user) {
        throw new appError_1.default(401, "Invalid credentials");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new appError_1.default(401, "Invalid credentials");
    }
    const jwtPayload = {
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        },
    };
});
// refresh token service to get new access token using refresh token
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        throw new appError_1.default(401, "Please provide refresh token");
    }
    const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!user) {
        throw new appError_1.default(401, "user not found");
    }
    const jwtPayload = {
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
exports.authServices = {
    createUser,
    loginUser,
    refreshToken
};
