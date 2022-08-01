import { Router, Request, Response } from "express";
import { requireAuth } from "../../../../middleware/Auth";

import { User } from "../models/User";
import { AuthRouter } from "./auth.router";

const router: Router = Router();

router.use("/auth", AuthRouter);

router.get("/", async (req: Request, res: Response) => {
  res.send("welcome to user controller!");
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  let { id } = req.params;
  const item = await User.findByPk(id);
  res.send(item);
});

export const UserRouter: Router = router;
