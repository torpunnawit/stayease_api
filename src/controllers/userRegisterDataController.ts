import { Request, Response } from "express";
import pool from "../db/pool";

export const userRegisterData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id } = req.params;
  console.log("user_id", user_id);

  const userDataSQL = `SELECT email,firstname,lastname FROM users WHERE user_id = $1`;
  try {
    const userDataResult = await pool.query(userDataSQL, [user_id]);
    const userData = userDataResult.rows;

    if (userData.length === 0) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    res.status(200).json({ status: "success", data: userData });
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
