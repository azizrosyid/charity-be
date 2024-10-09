import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

declare type WebError = Error & { status?: number };
export const errorHandler = (
    err: WebError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // set locals, only providing error in developmen    // render the error page
    res.status(err.status || 500);
    res.json({ error: err.message });
};

export const errorNotFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    next(createError(404));
};
