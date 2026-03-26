import { Router } from "express";
import problemRouter from "./problem.router";
import pingRouter from "./ping.router";

const v1Router=Router();

v1Router.use("/ping",pingRouter);
v1Router.use("/problems",problemRouter);

export default v1Router;