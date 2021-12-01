import { validate } from "class-validator";
import { RequestHandler } from "express";
import { userInfo } from "os";
//<img src="https://i.ibb.co/svPq37Q/62c39aa27b5f.png" alt="62c39aa27b5f" border="0">
import { User } from "../entity/User";
import AppError from "../utils/AppError";

export const updateUser: RequestHandler = async (req, res, next) => {
  const newUser = req.body;
  console.log(newUser);

  const userId = (<any>req.user).id;
  const oldUser = await User.findOne({ where: { id: userId } });

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
  const valErrors = await validate(oldUser);
  console.log(valErrors);

  if (valErrors.length > 0) {
    return next(new AppError("Validation Errors", 400, valErrors));
  }

  if (changedFields.length == 0) {
    changedFields.push("nothing");
  }

  await oldUser.save();

  return res.status(200).json({
    message: "success",
    changedFields,
    data: { oldUser },
  });
};

export const deleteUserAccount: RequestHandler = async (req, res, next) => {
  const userId = (<any>req.user).id;

  const user = await User.delete(userId);

  res.clearCookie("jwt").sendStatus(200);
};
