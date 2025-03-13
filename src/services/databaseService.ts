import pool from "../db/pool";
import insertRooms from "./insertRooms";

const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      firstname VARCHAR(100) NOT NULL,
      lastname VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Table 'users' created successfully.");
  } catch (error) {
    console.error("Error creating table 'users':", error);
  }
};

const createRoomsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS rooms (
      room_id SERIAL PRIMARY KEY,
      room_number INT UNIQUE NOT NULL,      
      type VARCHAR(50) NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Table 'rooms' created successfully.");
    await insertRooms();
  } catch (error) {
    console.error("Error creating table 'rooms':", error);
  }
};

const createBookingTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS booking (
      booking_id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      room_id INT NOT NULL,
      phone VARCHAR(20) NOT NULL,
      checkin_date DATE NOT NULL,
      checkout_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      CONSTRAINT fk_booking_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
   
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Table 'booking' created successfully.");
  } catch (error) {
    console.error("Error creating table 'booking':", error);
  }
};
const createTables = async () => {
  await createUsersTable();
  await createRoomsTable();
  await createBookingTable();
};

createTables()
  .then(() => {
    console.log("All tables created successfully.");
  })
  .catch((error) => {
    console.error("Error creating tables:", error);
  });
export { createTables };
