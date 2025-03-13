import { Request, Response } from "express";
import pool from "../db/pool";
import bcrypt from "bcryptjs";
import validateEmail from "../utils/validationEmail";
import validator from "../utils/validationPwd";
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstname, lastname } = req.body;

    if (!email) {
      res.status(400).json({ message: "Please provide email address" });
      return;
    }

    if (!password) {
      res.status(400).json({ message: "Please provide password" });
      return;
    }

    if (!firstname) {
      res.status(400).json({ message: "Please provide firstname" });
      return;
    }

    if (!lastname) {
      res.status(400).json({ message: "Please provide lastname" });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ message: "Invalid email address" });
      return;
    }

    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    const checkUser = await pool.query(checkUserQuery, [email]);

    if (checkUser.rows.length > 0) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const pwdValidator = validator.validate(password, {
      list: true,
    }) as string[];

    if (pwdValidator.length > 0) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `
      INSERT INTO users (email, password, firstname, lastname) 
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const newUser = await pool.query(insertUserQuery, [
      email,
      hashedPassword,
      firstname,
      lastname,
    ]);
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
