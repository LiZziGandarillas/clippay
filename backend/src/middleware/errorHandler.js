export const errorHandler = (err, req, res, next) => {
    console.error("Error:", {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });

    if (err.code === "P2002") {
        return res.status(409).json({
            error: "Duplicate entry",
            message: "This record already exists",
        });
    }

    if (err.code === "P2025") {
        return res.status(404).json({
            error: "Not found",
            message: "Record not found",
        });
    }

    if (err.message?.includes("not found")) {
        return res.status(404).json({
            error: "Not found",
            message: err.message,
        });
    }

    if (err.message?.includes("already")) {
        return res.status(409).json({
            error: "Conflict",
            message: err.message,
        });
    }

    if (err.message?.includes("Invalid") || err.message?.includes("required")) {
        return res.status(400).json({
            error: "Validation error",
            message: err.message,
        });
    }

    res.status(500).json({
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: "Endpoint not found",
        path: req.path,
        method: req.method,
    });
};

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
