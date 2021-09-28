import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";

export const signToken = (id: number) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000,
	});

export const createAndSendToken = (
	user: User,
	statusCode: number,
	res: Response,
	func?: (res: Response) => any
) => {
	const token = signToken(user.id);

	const cookieOptions: CookieOptions = {
		expires: new Date(
			Date.now() +
				parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	};

	res.cookie("jwt", token, cookieOptions);

	if (func) {
		return func(res);
	}

	user.auth = undefined;
	res.status(statusCode).json({
		status: "success",
		data: {
			user,
		},
	});
};
