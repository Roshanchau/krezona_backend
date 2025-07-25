import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import {authControllers} from "./auth.controller";

const router = express.Router();

router.post(
    "/signup",
    authControllers.signupUser
);

router.post(    
    "/login",
    validateRequest(AuthValidations.LoginValidationSchema),
    authControllers.loginUser
);

router.post(
    "/refreshToken",
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    authControllers.refreshToken
);


export const authRouter = router;