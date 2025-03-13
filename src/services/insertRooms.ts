import pool from "../db/pool";

const insertRoom = async (
  room_number: number,
  type: string,
  price: number
): Promise<void> => {
  const insertRoomQuery = `
    INSERT INTO rooms (room_number, type, price)
    VALUES ($1, $2, $3);
  `;

  try {
    await pool.query(insertRoomQuery, [room_number, type, price]);
    console.log(`Room ${room_number} inserted successfully.`);
  } catch (error) {
    console.error(`Error inserting room ${room_number}:`, error);
    throw error;
  }
};

const insertRooms = async () => {
  try {
    const checkRoomsQuery = `SELECT COUNT(*) FROM rooms`;
    const result = await pool.query(checkRoomsQuery);
    const roomCount = parseInt(result.rows[0].count, 10);

    if (roomCount > 0) {
      console.log("Rooms already exist in the database. Skipping insertion.");
      return;
    }

    await insertRoom(1, "Standard", 200);
    await insertRoom(2, "Deluxe", 300);
    await insertRoom(3, "Luxury", 500);
    await insertRoom(4, "Standard", 200);
    await insertRoom(5, "Deluxe", 300);
    await insertRoom(6, "Luxury", 500);

    console.log("All rooms inserted successfully.");
  } catch (error) {
    console.error("Error inserting rooms:", error);
  }
};

export default insertRooms;
