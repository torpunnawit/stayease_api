import { Request, Response } from "express";
import pool from "../db/pool";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rowCount === 0) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    req.session.userId = user.user_id;
    console.log("req.session.userId login():", req.session.userId);

    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Session error" });
      }
      console.log(req.session);
      res.json({ message: "Login successful", token, session: req.session });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
