const success = (statusCode, result) => {
    return {
        status: "ok",
        statusCode,
        result,
    };
};

const errors = (statusCode, message) => {
    return {
        status: "error",
        statusCode,
        message,
    };
};

module.exports = {
    success,
    errors,
};
