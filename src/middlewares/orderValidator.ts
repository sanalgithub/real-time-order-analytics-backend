import { validationResult } from "express-validator";
import { NextFunction , Request, Response } from "express";
import { HttpStatusCode } from "../constants/httpStatusCode";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
};
