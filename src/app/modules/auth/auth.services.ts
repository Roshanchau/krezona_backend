import { TUser , TLoginAuth } from "./auth.interface";
import bcrypt from "bcrypt";
import AppError from "../../errors/appError";
import {createToken} from "./auth.utils"
import jwt , {JwtPayload}from "jsonwebtoken";

import prismadb from "../../db/prismaDb";
import config from "../../config";

import z from "zod";

const emailSchema = z.string().email();

// create user
const createUser = async (payload: Partial<TUser>) => {
  const { name , email , password , role } = payload;

    if (!name || !email || !password || !role) {
        throw new AppError(400, "Please provide all fields");
    }

  const emailValidation = emailSchema.safeParse(email);
  if (!emailValidation.success) {
    throw new AppError(400, "Invalid email format");
  }

  const existingUser = await prismadb.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new AppError(400, "User already exists with this email");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user= await prismadb.user.create({
    data:{
        name: name,
        email: email,
        password: hashedPassword,
        role
    }
    });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

// login user
const loginUser = async (payload: TLoginAuth) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw new AppError(400, "Please provide all fields");
    }

    const user = await prismadb.user.findFirst({
        where: {
            email: email,
        },
    });

    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new AppError(401, "Invalid credentials");
    }

    const jwtPayload = {
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
      };
    
      const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
      );
    
      const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
      );
    
      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        },
      }
}

// refresh token service to get new access token using refresh token
const refreshToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new AppError(401, "Please provide refresh token");
    }

    const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret as string) as JwtPayload;

    const {email}= decoded as {email:string};

    const user = await prismadb.user.findFirst({
        where: {
            email: email,
        },
    });

    if(!user) {
        throw new AppError(401, "user not found");
    }

    const jwtPayload = {
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    );

    return {accessToken};
}

export const authServices = {
    createUser,
    loginUser,
    refreshToken
};