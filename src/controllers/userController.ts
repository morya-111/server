import { validate } from "class-validator";
import { RequestHandler } from "express";
import { compare } from "bcryptjs"; //<img src="https://i.ibb.co/svPq37Q/62c39aa27b5f.png" alt="62c39aa27b5f" border="0">
import { User } from "../entity/User";
import AppError from "../utils/AppError";
import { hashSync } from "bcryptjs";

export const updateUser: RequestHandler = async (req, res, next) => {
  const newUser = req.body;

  const userId = (<any>req.user).id;
  const oldUser = await User.findOne({ id: userId }, { relations: ["auth"] });

  const changedFields: string[] = [];

  if (newUser.email && newUser.email !== oldUser.email) {
    return next(new AppError("Changing Email is not allowed.", 401));
  }
  if (newUser.role && newUser.role !== oldUser.role) {
    return next(new AppError("Changing Role is not allowed.", 401));
  }
  if (newUser.avatarUrl && newUser.avatarUrl !== oldUser.avatarUrl) {
    oldUser.avatarUrl = newUser.avatarUrl;
    changedFields.push("Avatar URL");
  }
  if (newUser.first_name && newUser.first_name !== oldUser.first_name) {
    oldUser.first_name = newUser.first_name;
    changedFields.push("first_name");
  }
  if (newUser.last_name && newUser.last_name !== oldUser.last_name) {
    oldUser.last_name = newUser.last_name;
    changedFields.push("last_name");
  }

  if (newUser.password) {
    if (oldUser.auth.password) {
      return next(
        new AppError(`User has not signed up using BookEx Auth System `, 404)
      );
    } else if (await compare(newUser.password, oldUser.auth.password)) {
      return next(new AppError(`New Password can not be same as before `, 401));
    } else {
      oldUser.auth.password = newUser.password;
      const authVal = await validate(oldUser.auth);
      if (authVal.length > 0) {
        return next(
          new AppError(`Validation Errors in new password`, 401, authVal)
        );
      }
      changedFields.push("password");

      oldUser.auth.password = hashSync(oldUser.auth.password, 12);
      await oldUser.auth.save();
    }
  }

  const valErrors = await validate(oldUser);

  if (valErrors.length > 0) {
    return next(new AppError("Validation Errors", 400, valErrors));
  }

  if (changedFields.length == 0) {
    changedFields.push("nothing");
  }

  await oldUser.save();

  oldUser.auth = undefined;

  return res.status(200).json({
    message: "success",
    changedFields,
    data: { newUser: oldUser },
  });
};

export const getLoggedInUsing: RequestHandler = async (req, res, next) => {
  const userId = (<User>req.user).id;
  const user = await User.findOne(userId, { relations: ["auth"] });
  let loggedInUsing: string;
  if (user.auth.password) {
    loggedInUsing = "BOOKEX";
  } else if (user.auth.facebook_id) {
    loggedInUsing = "FB";
  } else if (user.auth.google_id) {
    loggedInUsing = "GOOGLE";
  }

  res.status(200).json({
    message: "success",
    data: { loggedInUsing },
  });
};

export const deleteUserAccount: RequestHandler = async (req, res, next) => {
  const userId = (<any>req.user).id;

  const user = await User.delete(userId);

  res.clearCookie("jwt").sendStatus(200);
};
