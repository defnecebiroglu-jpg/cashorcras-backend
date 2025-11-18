import type { NextFunction, Request, Response } from "express";

function getRequestAdminToken(req: Request): string | undefined {
  const headerToken = typeof req.headers["x-admin-token"] === "string"
    ? req.headers["x-admin-token"]
    : Array.isArray(req.headers["x-admin-token"])
      ? req.headers["x-admin-token"][0]
      : undefined;

  if (headerToken) {
    return headerToken;
  }

  if (typeof req.query.adminToken === "string") {
    return req.query.adminToken;
  }

  if (Array.isArray(req.query.adminToken) && req.query.adminToken.length > 0) {
    return req.query.adminToken[0];
  }

  return undefined;
}

export function checkAdmin(req: Request, res: Response, next: NextFunction) {
  const expectedToken = process.env.ADMIN_TOKEN;
  const incomingToken = getRequestAdminToken(req);

  if (expectedToken && incomingToken === expectedToken) {
    return next();
  }

  return res.status(403).json({ message: "Not authorized as admin" });
}


