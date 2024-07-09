class ApiError extends Error {
    constructor(statusCode, message, errors = [], stackTrace) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        if (stackTrace) {
            this.stackTrace = stackTrace;
        } else {
            this.stackTrace = Error.captureStackTrace(this, this.costructor);
        }
    }
}

export { ApiError };
