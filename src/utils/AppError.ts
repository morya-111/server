class AppError extends Error {
	statusCode: number;
	err: any;

	constructor(msg, statusCode, err?: any) {
		super(msg);

		this.statusCode = statusCode;
		this.err = err;
		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;
