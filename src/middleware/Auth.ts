import * as bcrypt from "bcrypt";
import { config } from "../config/config";

import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  let token;
  //this middleware fits for both headers and cookies verification
  //check if the token is in the header
  if (req.headers && req.headers.authorization) {
    const token_bearer = req.headers.authorization.split(" ");
    if (token_bearer.length != 2)
      return res.status(401).send({ message: "Malformed token." });
    token = token_bearer[1];
    //check if the token is in the cookie
  } else if (req.cookies.token) token = req.cookies.token;
  if (!token) return res.status(401).send({ message: "No token provided." });
  const secret = config.jwt.secret;
  return jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate." });

    return next();
  });
}
