import { StatusCodes } from "http-status-codes";

import { User } from "@/api/user/userModel";
import { userRepository } from "@/api/user/userRepository";
import {
  ResponseStatus,
  ServiceResponse,
} from "@/common/models/serviceResponse";
import { logger } from "@/server";

import { UserTable } from "../../drizzle/schema";
import { db } from "@/drizzle/db";

import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";
import { env } from "@/common/utils/envConfig";

export const userService = {
  // Retrieves all users from the database
  findAll: async (): Promise<ServiceResponse<User[] | null>> => {
    try {
      const users = await userRepository.findAllAsync();
      if (!users) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "No Users found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<User[]>(
        ResponseStatus.Success,
        "Users found",
        users,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // Retrieves a single user by their ID
  findById: async (id: number): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<User>(
        ResponseStatus.Success,
        "User found",
        user,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  // Creates a new User Record
  createNewUser: async (body: any): Promise<ServiceResponse<User | null>> => {
    try {
      const hashPass = await hash(body.password, 10);
      const newUser = await db
        .insert(UserTable)
        .values({
          name: body.name,
          email: body.email,
          password: hashPass,
        })
        .returning();

      if (!newUser) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      console.log("newUser", newUser);
      const payload = {
        sub: newUser[0].id,
        iat: moment().unix(),
        exp: moment().add(3, "days").unix(),
        type: "access",
      };
      const token = jwt.sign(payload, env.APP_SECRET);
      return new ServiceResponse<any>(
        ResponseStatus.Success,
        "User found",
        { token, user: newUser },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating a new user:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
