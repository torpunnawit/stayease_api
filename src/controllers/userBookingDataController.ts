import { Request, Response } from "express";
import pool from "../db/pool";

export const userBookingData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id } = req.params;

  const userBookingDataSQL = ` SELECT 
      users.user_id,
      users.email,
      users.firstname,
      users.lastname,
      booking.booking_id,
      booking.room_id,
      booking.phone,
      booking.checkin_date,
      booking.checkout_date,
      booking.created_at
    FROM 
      users
    JOIN 
      booking ON users.user_id = booking.user_id
    WHERE 
      users.user_id = $1`;
  try {
    const userBookingDataResult = await pool.query(userBookingDataSQL, [
      user_id,
    ]);
    const userBookingData = userBookingDataResult.rows;

    if (userBookingData.length === 0) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    res.status(200).json({ status: "success", data: userBookingData });
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
