import { NextFunction, Request, Response } from "express";

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const logger = require("./logging");

module.exports = (app: typeof express) => {
  app.use(
    express.json({
      limit: "50mb",
    })
  );
  app.use(
    rateLimit({
      max: 100,
      windowMs: 60 * 1000,
      message: "too many requests , coming from this adr",
    })
  );
  app.use(helmet());
  app.use(morgan("tiny"));
  app.use(cookieParser());
  // parse application/x-www-form-urlencoded
  app.use(
    express.urlencoded({
      extended: true,
      limit: "50mb",
      parameterLimit: 100000,
    })
  );
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // Switch off the default 'X-Powered-By: Express' header
    app.disable("x-powered-by");
    // OR set your own header here
    res.setHeader("X-Powered-By", "Mehdi App v0.0.1");
    next();
  });

  process.on("uncaughtException", (err) => {
    logger.error(`error name ${err.name}`);
    logger.error(`error message ${err.message}`);
    logger.error("uncaught exception==> shutting down");
    process.exit(1);
  });
};
