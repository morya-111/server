import { ErrorRequestHandler } from "express";

const globalErrorhandler: ErrorRequestHandler = (err, req, res, next) => {
	if (err.hasOwnProperty("statusCode")) {
		res.status(err.statusCode).json({
			status: "fail",
			message: err.message,
			error: err.err,
		});
		return;
	}
	res.status(500).json({
		status: "fail",
		message: err.message,
		error: err,
	});
};

export default globalErrorhandler;
