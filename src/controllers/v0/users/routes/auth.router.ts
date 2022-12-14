import { Router, Request, Response } from "express";

import { User } from "../models/User";

import * as EmailValidator from "email-validator";
import { requireAuth } from "../../../../middleware/Auth";

const router: Router = Router();

router.get("/verification", requireAuth, async (req: Request, res: Response) =>
  res.status(200).send({ auth: true, message: "Authenticated." })
);

router.post("/login", async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  // check email is valid
  if (!email || !EmailValidator.validate(email))
    return res
      .status(400)
      .send({ auth: false, message: "Email is required or malformed" });

  // check email password valid
  if (!password)
    return res
      .status(400)
      .send({ auth: false, message: "Password is required" });

  const user = await User.findByPk(email);
  // check that user exists
  if (!user)
    return res.status(401).send({ auth: false, message: "Unauthorized" });

  // check that the password matches
  const authValid = await User.comparePasswords(password, user.password_hash);

  if (!authValid)
    return res.status(401).send({ auth: false, message: "Unauthorized" });

  // Generate JWT
  const jwt = User.generateJWT(user);

  res
    .status(200)
    .cookie("token", jwt, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
    })
    .send({ auth: true, token: jwt, user: user.short() });
});

//register a new user : api/v0/register
router.post("/", async (req: Request, res: Response) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password;
  // check email is valid
  if (!email || !EmailValidator.validate(email))
    return res
      .status(400)
      .send({ auth: false, message: "Email is required or malformed" });

  // check email password valid
  if (!plainTextPassword)
    return res
      .status(400)
      .send({ auth: false, message: "Password is required" });

  // find the user
  const user = await User.findByPk(email);
  // check that user doesnt exists
  if (user)
    return res
      .status(422)
      .send({ auth: false, message: "User may already exist" });

  const password_hash = await User.generatePassword(plainTextPassword);

  const newUser = await new User({
    email: email,
    password_hash: password_hash,
  });

  let savedUser;
  try {
    savedUser = await newUser.save();
  } catch (e) {
    throw e;
  }

  // Generate JWT
  const jwt = User.generateJWT(savedUser);

  res
    .status(201)
    .cookie("token", jwt, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
    })
    .send({ token: jwt, user: savedUser.short() });
});
router.post("/logOut", requireAuth, async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.send({ message: "logged out" });
});

router.get("/userinfo", async (req: Request, res: Response) => {
  res.send("auth");
});

export const AuthRouter: Router = router;
