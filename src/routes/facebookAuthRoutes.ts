import express from "express";
import passport from "passport";
import { User } from "../entity/User";
import { createAndSendToken } from "../utils/auth";

const router = express.Router();

const {
	FRONTEND_CLIENT = "http://localhost:3000",
	FAILURE_ROUTE = "/login",
	SUCCESS_ROUTE = "/dashboard",
} = process.env;

router.get("/", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
	"/callback",
	passport.authenticate("facebook", {
		failureRedirect: `${FRONTEND_CLIENT}${FAILURE_ROUTE}`,
		session: false,
	}),
	function (req, res) {
		// Successful authentication, redirect home.
		createAndSendToken(req.user as User, 200, res, (newRes) => {
			newRes.redirect(`${FRONTEND_CLIENT}${SUCCESS_ROUTE}`);
		});
	}
);

export default router;
