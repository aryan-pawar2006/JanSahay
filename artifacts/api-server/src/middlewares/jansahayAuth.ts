import { getAuth } from "@clerk/express";
import type { RequestHandler } from "express";

const configuredAdminIds = new Set(
  (process.env.JANSAHAY_ADMIN_USER_IDS ?? "")
    .split(",")
    .map((userId) => userId.trim())
    .filter(Boolean),
);

function isAdmin(req: Parameters<RequestHandler>[0], userId: string): boolean {
  const claims = getAuth(req).sessionClaims as
    | {
        metadata?: { role?: unknown };
        publicMetadata?: { role?: unknown };
      }
    | null;
  return (
    configuredAdminIds.has(userId) ||
    claims?.publicMetadata?.role === "admin" ||
    claims?.metadata?.role === "admin"
  );
}

export const requireCitizen: RequestHandler = (req, res, next) => {
  if (!getAuth(req).userId) {
    res.status(401).json({ error: "Sign in to access this information." });
    return;
  }
  next();
};

export const requireJanSahayAdmin: RequestHandler = (req, res, next) => {
  const userId = getAuth(req).userId;
  if (!userId) {
    res.status(401).json({ error: "Sign in to access administrator tools." });
    return;
  }
  if (!isAdmin(req, userId)) {
    res.status(403).json({ error: "Administrator access is required." });
    return;
  }
  next();
};
