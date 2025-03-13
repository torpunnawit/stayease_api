import { Request, Response, NextFunction } from "express";
import pool from "../db/pool";
import { Session } from "express-session";

interface AuthRequest extends Request {
  session: Session & {
    userId?: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.session || !req.session.userId) {
      res.status(401).json({ message: "Unauthorized: Please log in" });
      return;
    }
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      req.session.userId,
    ]);

    if (result.rows.length === 0) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    console.log("User logged in successfully:", result.rows[0].email);
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
