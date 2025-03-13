import { Request, Response } from "express";
import pool from "../db/pool";

export const bookedDate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const bookedDateSQL = `SELECT room_id ,checkin_date FROM booking `;
  try {
    const bookedDateResult = await pool.query(bookedDateSQL);
    const bookedDate = bookedDateResult.rows;
    res.status(200).json({ status: "success", data: bookedDate });
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
