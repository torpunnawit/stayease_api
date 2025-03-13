import { Request, Response } from "express";
import pool from "../db/pool";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const booking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstname, lastname, email, phone, checkin, checkout, room_id } =
      req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !checkin ||
      !checkout ||
      !room_id
    ) {
      res
        .status(400)
        .json({ status: "failed", message: "Missing required fields" });
      return;
    }

    const checkinDate = dayjs(checkin).tz("Asia/Bangkok").format("YYYY-MM-DD");
    const checkoutDate = dayjs(checkout)
      .tz("Asia/Bangkok")
      .format("YYYY-MM-DD");
    const today = dayjs()
      .startOf("day")
      .tz("Asia/Bangkok")
      .format("YYYY-MM-DD");

    if (checkinDate < today) {
      res.status(400).json({
        status: "failed",
        message: "Check-in date cannot be in the past",
      });
      return;
    }

    if (checkoutDate < checkinDate) {
      res.status(400).json({
        status: "failed",
        message: "Check-out date must be after check-in date",
      });
      return;
    }

    if (checkinDate === checkoutDate) {
      res.status(400).json({
        status: "failed",
        message: "Check-in and check-out dates cannot be the same day",
      });
      return;
    }

    const userCheckSQL = `SELECT * FROM users WHERE email = $1`;
    const userCheckResult = await pool.query(userCheckSQL, [email]);

    if (userCheckResult.rows.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "User does not exist",
      });
      return;
    }

    const checkAvailabilitySQL = `
      SELECT * FROM booking
       WHERE room_id = $3 
       AND daterange(checkin_date, checkout_date, '[]') && daterange($1::date, $2::date, '[]')
    `;
    const existingBooking = await pool.query(checkAvailabilitySQL, [
      checkinDate,
      checkoutDate,
      room_id,
    ]);

    if (existingBooking.rows.length > 0) {
      res
        .status(400)
        .json({ status: "failed", message: "This period is already booked" });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertSQL = `
        INSERT INTO booking (user_id, room_id, phone, checkin_date, checkout_date)
        VALUES ($1, $2, $3, $4, $5);
      `;

      await client.query(insertSQL, [
        userCheckResult.rows[0].user_id,
        room_id,
        phone,
        checkinDate,
        checkoutDate,
      ]);

      await client.query("COMMIT");
      res
        .status(200)
        .json({ status: "success", message: "Booking successful" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction Error:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
