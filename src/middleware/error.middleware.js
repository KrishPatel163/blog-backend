const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || "Something went wrong";

    console.log(errStatus, errMsg);

    return res.status(errStatus).send({
        statusCode: errStatus,
        message: errMsg,
    });
};

export { errorMiddleware };
