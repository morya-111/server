import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";

// Days. Defaults keep cookie `expires` valid when the env vars are unset.
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || "7");
const JWT_COOKIE_EXPIRES_IN = parseInt(
	process.env.JWT_COOKIE_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "7"
);

export const signToken = (id: number) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: `${JWT_EXPIRES_IN}d`,
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
			Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development",
		// client and API share an origin (Vercel rewrite / CRA proxy)
		sameSite: "lax",
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
